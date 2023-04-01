nuSetPlaceholder('sus_code', nuTranslate('(Optional)'))
nuSetToolTip('sus_code', nuTranslate('E.g. Employee Id, Foreign Id etc. Leaving blank will set the "Login Name"'))
nuSetToolTip('sus_language', nuTranslate('Leaving blank will use English'))
if (nuIsNewRecord()) nuHide('sus_zzzzsys_access_id_open_button')
$('#sus_zzzzsys_access_id_open_button').toggleClass('input_button nuButton nuLookupButton')
nuSelectAddEnglishOption('sus_language')

function nuTogglePasswordVisibility () {
  $('#new_password').nuTogglePassword()
  $('#check_password').nuTogglePassword()
}

function nuBeforeSave () {
  const code = $('#sus_code')
  if (code.val() === '') {
    code.nuSetValue(nuGetValue('sus_login_name'))
  }

  return true
}
