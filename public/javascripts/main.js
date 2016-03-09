$(document).ready(function () {
    var left = null;
    $(".diff").click(function () {
        if (left === $(this).attr('id')) {
            left = null;
            $(this).removeClass("active");
            $(".diff").text("Select to compare");
        } else if (left === null) {
            $(this).addClass("active");
            $(".diff").text("Compare");
            $(this).text("Selected as left");
            left = $(this).attr('id');
        } else {
            right = $(this).attr('id');
            repo = left.split('#')[0];
            hash1 = left.split('#')[1];
            hash2 = right.split('#')[1];
            left = null;
            $('.diff').text("Select to compare");
            $('.diff').removeClass('active');
            window.open("https://github.com/" + repo + '/compare/' + hash1 + '...' + hash2);
        }
    });
});