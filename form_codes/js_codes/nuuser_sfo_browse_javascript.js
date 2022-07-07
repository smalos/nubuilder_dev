$(function () {
  nuAddBrowseTitleSelect(9, ['', 'Expired'])
  $('#nuBrowseTitle9_select').parent().unbind('touchstart')

  nuAddBrowseTitleSelect(3, getAccessLevel())
  $('#nuBrowseTitle3_select').parent().unbind('touchstart')

  nuAddBrowseTitleSelect(4, getLanguage())
  $('#nuBrowseTitle4_select').parent().unbind('touchstart')

  nuAddBrowseTitleSelect(6, getPosition())
  $('#nuBrowseTitle6_select').parent().unbind('touchstart')

  nuAddBrowseTitleSelect(7, getDepartment())
  $('#nuBrowseTitle7_select').parent().unbind('touchstart')

  nuAddBrowseTitleSelect(8, getTeam())
  $('#nuBrowseTitle8_select').parent().unbind('touchstart')
})
