function nuBeforeSave () {
  const dupF = nuSubformColumnUnique('accform', 'slf_zzzzsys_form_id', 'Forms')
  const dupP = nuSubformColumnUnique('accphp', 'slp_zzzzsys_php_id', 'Procedures')
  const dupR = nuSubformColumnUnique('accreport', 'sre_zzzzsys_report_id', 'Reports')

  if (dupF !== true || dupP !== true || dupR !== true) {
    const a = []
    if (!dupF) a.push(dupF)
    if (!dupP) a.push(dupP)
    if (!dupR) a.push(dupR)

    nuMessage(a)
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
