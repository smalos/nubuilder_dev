
function nuBeforeSave () {
  const subforms = [
    { name: 'accform', column: 'slf_zzzzsys_form_id', title: 'Forms' },
    { name: 'accphp', column: 'slp_zzzzsys_php_id', title: 'Procedures' },
    { name: 'accreport', column: 'sre_zzzzsys_report_id', title: 'Reports' }
  ]
  const duplicates = subforms.filter(subform => !nuSubformColumnUnique(subform.name, subform.column, subform.title))
  if (duplicates.length) {
    const duplicateTitles = duplicates.map(subform => subform.title)
    nuMessage(`Duplicate ${duplicateTitles.join(', ')} found`)
    return false
  }
  return true
}

function addSfFilter () {
  const sfFilter = {}
  sfFilter.accform = {
    slf_zzzzsys_form_id: {
      type: 'search',
      float: 'left',
      placeholder: nuTranslate('Search')
    }
  }

  nuSubformAddFilter(sfFilter)
}

$('#sal_zzzzsys_form_id_open_button').toggleClass('input_button nuButton nuLookupButton')
if (nuIsNewRecord()) nuHide('sal_zzzzsys_form_id_open_button')

nuAccessFormSetButtonIcons()
addSfFilter()
