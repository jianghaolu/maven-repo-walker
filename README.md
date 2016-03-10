# MavenRepoWalker
```
GET /?dir=<directory>
```
User friendly web interface for viewing directory `<directory>`. E.g. `/?dir=com/example` lists all the directories and files under `com/example`.

```
GET /<path>
```
Direct file access to `<path>`. This is the API for maven to access files. E.g. maven will fetch `com.example:sampleapp:1.0.0-SNAPSHOT` in `/com/example/sampleapp/1.0.0-SNAPSHOT/sampleapp-1.0.0-SNAPSHOT.jar`.

```
PUT /upload?file=<file>
```
Upload a file. The folder structure will be matched as it is locally. E.g. `com/example/sampleapp/0.1.2/sampleapp-0.1.2.jar` will appear in directory `com/example/sampleapp/0.1.2` on the server.
