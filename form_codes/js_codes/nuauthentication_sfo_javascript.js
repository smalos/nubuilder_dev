function nuGet2FAProcedure() {
    var d = nuDevMode();
    var p = 'nuAuthentication2FA';
    return d ? p + '_Template' : p;
}

function nu2FAVerify() {
    nuSetProperty('auth_code_verify',  $('#auth_code').val());
    nuSetProperty("nuauthcommand","verify");
    var p = nuGet2FAProcedure();
    nuRunPHPHidden(p ,0);
}

function nu2FASendToken() {
    nuSetProperty("nuauthcommand","send");
    var p = nuGet2FAProcedure();
    nuRunPHPHidden(p ,0);
}

function handleEnterKey() {

    $('#auth_code').on('keydown', function(evt) {
      if (evt.key === 'Enter') {
            evt.preventDefault();
            nu2FAVerify();
      }
    });

}

handleEnterKey();
nuHideHolders(0,2);



// Prevent [DOM] Password field is not contained in a form:
$("#auth_code_verify").wrap("<form id='nuFromVerif' action='#' method='post' onsubmit='return false'>");