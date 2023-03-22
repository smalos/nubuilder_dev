$('#user_home').addClass('nuUserHomeButton')
$('.nuActionButton').hide()
$('#open_database').attr('title', 'PHPMyAdmin')

nuGetStartingTab()

// Change the button height to 45px for certain languages:
const l = nuUserLanguage()
if (l == 'Vietnamese' || l == 'Armenian' || l == 'Tamil') {
  $('.nuButton').css('height', '45')
} else if (l == 'Portuguese') {
  $('.nuButton').css('height', '38')
}

if (nuSERVERRESPONSE.is_demo) {
  $('#run_session').remove()
}
