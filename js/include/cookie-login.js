//// COOKIES & LOGIN
function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var pw = getCookie("validatepassword");
    if (pw != "") {
        // Niks
    } else {
        metroDialog.open('#login-dialog');
    }
}

$('#login-dialog input').keyup(function () {
    var val = $(this).val();
    $.post('../api/validate.php', {
        'token': val
    }, function (data) {
        if (data === 1) {
            $('#login-dialog button').prop('disabled', false);

        }
    })
});

$('#login-dialog button').click(function() {
    setCookie("validatepassword", 1);
    metroDialog.close('#login-dialog');
})
