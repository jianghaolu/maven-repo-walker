var fs = require('fs');
var path = require('path');

exports.index = function (req, res) {
    console.log(req.query);
    var dir = req.query['dir'];
    files = listFiles(dir);
    console.log(files);
    var isFileCount = 0;
    for (var file in files) {
        if (!file.dir) {
            isFileCount++;
        }
    }
    res.render('index', { title: 'ADX Snapshots Repository', year: new Date().getFullYear(), files: files, jdiff: isFileCount >= 2 });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
};

exports.view = function (req, res) {
    var rootPath = path.join(path.resolve(__dirname), '..');
    file = req.query['file'];
    res.setHeader('Content-Type', 'application/xml');
    res.send(fs.readFileSync(path.join(rootPath, file)));
}

exports.download = function (req, res) {
    var rootPath = path.join(path.resolve(__dirname), '..');
    file = req.query['file'];
    splitted = file.replace('\\', '/').split('/');
    filename = splitted[splitted.length - 1];
    res.setHeader('Content-disposition', 'attachment; filename=' + filename);
    res.setHeader('Content-Type', 'application/x-download');
    
    var filestream = fs.createReadStream(path.join(rootPath, file));
    filestream.pipe(res);
}

exports.upload = function (req, res) {
    var rootPath = path.join(path.resolve(__dirname), '..');
    var filePath = path.join(rootPath, req.query.file);
    var dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
    }
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    req.on('end', function () {
        fs.writeFile(filePath, body, function (err) {
            if (err !== null) {
                res.status(400).end(err);
            }
            res.status(200).end();
        });
    });
}

var listFiles = function (dir) {
    var rootPath = path.join(path.resolve(__dirname), '../');
    console.log(rootPath);
    var root = false;
    if (dir === undefined || dir === '.' || dir === '') {
        dir = '';
        root = true;
    }
    files = [];
    dirs = []
    if (!root) {
        dirs.push({ name: '..', path: path.join(dir, '..'), dir: true });
    }
    fs.readdirSync(path.join(rootPath, dir)).forEach(function (name) {
        dir = dir.replace(/\\/g, '/');
        var filePath = path.join(dir, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile() && name.match(/.+\.pom$/) !== null) {
            name = name.replace('.pom', '');
            var partial = path.join(dir, name);
            var jar = false;
            var sources = false;
            var javadoc = false;
            var github = false;
            if (fs.existsSync(partial + ".jar")) {
                jar = true;
            }
            if (fs.existsSync(partial + "-sources.jar")) {
                sources = true;
            }
            if (fs.existsSync(partial + "-javadoc.jar")) {
                javadoc = true;
            }
            if (fs.existsSync(partial + ".gitrevision")) {
                github = fs.readFileSync(partial + ".gitrevision").toString();
            }
            files.push({ name: name, path: path.join(dir, name), dir: false, jar: jar, sources: sources, javadoc: javadoc, github: github });
        } else if (stat.isDirectory() && (name === 'com' || !root)) {
            dirs.push({ name: name, path: path.join(dir, name), dir: true });
        }
    });
    return dirs.concat(files.reverse());
}