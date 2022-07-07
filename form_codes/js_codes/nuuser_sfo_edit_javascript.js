nuSetPlaceholder('sus_code', nuTranslate('(Optional)'));
nuSetToolTip('sus_code', nuTranslate('E.g. Employee Id, Foreign Id etc. Leaving blank will set the "Login Name"'));
nuSetToolTip('sus_language', nuTranslate('Leaving blank will use English'));
if (nuIsNewRecord()) nuHide('sus_zzzzsys_access_id_open_button');
$('#sus_zzzzsys_access_id_open_button').toggleClass('input_button nuButton nuLookupButton')

$(function() {
    setTimeout(function() {
        nuEnable('sus_name');
        nuEnable('sus_login_name');
        nuEnable('new_password');
        nuEnable('check_password');
    }, 800);
});

function nuTogglePasswordVisibility() {

    let p1 = $("#new_password");
    let p2 = $("#check_password");

    if (p1.prop("type") === "password") {
        p1[0].type = "text";
        p2[0].type = "text";
    } else {
        p1[0].type = "password";
        p2[0].type = "password";
    }

}

function nuBeforeSave() {

    let code = $('#sus_code');
    if (code.val() === '') {
        code.nuSetValue(nuGetValue('sus_login_name'));
    }

    return true;

}