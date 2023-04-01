if (nuFormType() == 'edit') {
  $('#sre_layout').addClass('nuEdited')
  nuAttachButtonImage('open_builder', 'RD')

  if (!nuIsNewRecord()) {
    //    nuAddActionButton('Run', 'Run', 'nuRunReport("'+ $('#sre_code').val() +'")');
  }
}

function nuPickTableType () {
  const i = $('#sre_zzzzsys_php_id').val()

  let f = ''
  let r = ''

  if (i.substr(0, 10) == 'PROCEDURE:') {
    f = 'nuphp'
    r = i.substr(10)
  }

  if (i === '') {
    nuMessage([nuTranslate('No table selected')])
    return
  }

  if (i.substr(0, 6) == 'TABLE:') {
    nuMessage(nuTranslate(['To edit a table go to the Database Button']))
    return
  }

  if (i.substr(0, 4) == 'SQL:') {
    f = 'nuselect'
    r = i.substr(4)
  }

  nuPopup(f, r)
}

function nuUpdateAclCount () {
  const l = $("[data-nu-field='sre_zzzzsys_access_id']").length - 2
  const t = l <= 0 ? '' : ' (' + l + ')'
  $('#nuTab1').html(nuTranslate('Access Level') + t)
}
