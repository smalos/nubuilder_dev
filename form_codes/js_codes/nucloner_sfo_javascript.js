function nuSelectObjectRefreshed (o, f) {
  nuSelectRemoveEmpty()
  if (f == 'clo_tabs') {
    $('select#' + f + ' > option').prop('selected', 'selected')
  }
}

function addRunButton () {
  nuAddActionButton('nuRunPHPHidden', 'Run', 'runCloner()')
  $('#nunuRunPHPHiddenButton').css('background-color', '#117A65')
}

function selectToIndexArray (id) {
  const a = []
  $('#' + id + ' option:selected').each(function (index) {
    if ($(this).text() !== '') {
      a.push($(this).index() + 1)
    }
  })
  return a
}

function selectToValueArray (id) {
  const a = []
  $('#' + id + ' option:selected').each(function (index) {
    if ($(this).text() !== '') {
      a.push($(this).text())
    }
  })

  return a
}

function runCloner () {
  if ($('#clo_form_source').val() === '') {
    nuMessage([nuTranslate('Source Form cannot be left blank.')])
    return
  }

  if ($('#clo_tabs :selected').length === 0) {
    nuMessage([nuTranslate('Select at least 1 Tab.')])
    return
  }

  nuSetProperty('cloner_refresh_selectId', '')

  const tabs = selectToIndexArray('clo_tabs')
  nuSetProperty('cloner_tabs', tabs.length === 0 ? '' : JSON.stringify(tabs))

  const subforms = $('#clo_subforms_include').is(':checked')
  const clo_subforms = selectToValueArray('clo_subforms')
  nuSetProperty('cloner_subforms', subforms === false || clo_subforms.length === 0 ? '0' : JSON.stringify(clo_subforms))

  const formsRunIFrame = selectToValueArray('clo_iframe_forms')
  nuSetProperty('cloner_iframe_forms', formsRunIFrame === false || formsRunIFrame.length === 0 ? '0' : JSON.stringify(formsRunIFrame))

  const dump = $('#clo_dump').is(':checked')
  nuSetProperty('cloner_dump', dump ? '1' : '0')

  const noObjects = $('#clo_objects').is(':checked')
  nuSetProperty('cloner_objects', noObjects ? '0' : '1')

  const newPks = $('#clo_new_pks').is(':checked')
  nuSetProperty('cloner_new_pks', newPks ? '1' : '0')

  const replaceInto = $('#clo_sql_replace_into').is(':checked')
  nuSetProperty('cloner_replace_into', replaceInto ? '1' : '0')

  nuSetProperty('cloner_form_source', $('#clo_form_source').val())
  nuSetProperty('cloner_form_dest', $('#clo_form_dest').val())
  nuSetProperty('cloner_notes', '#clo_notes#')

  dump ? nuRunPHP('nucloner', '', 1) : nuRunPHPHidden('nucloner', 0)
}

function setTitle () {
  if (!nuIsNewRecord()) {
    nuSetTitle($('#clo_form_source').val())
  }
}

function setDefaultValues () {
  if (nuIsNewRecord()) {
    $('#clo_new_pks').prop('checked', true).change()
    $('#clo_dump').prop('checked', true).change()
  }
}

function setParentFormId () {
  if (parent.$('#nuModal').length > 0 && $('#clo_form_source').val() === '') {
    nuGetLookupId(window.parent.nuCurrentProperties().form_id, 'clo_form_source')
  }
}

function cloSubformsChecked () {
  const c = $('#clo_subforms_include').is(':checked')
  c ? nuEnable('clo_subforms') : nuDisable('clo_subforms')
  nuSelectSelectAll('clo_subforms', c)
}

function cloIframeFormsChecked () {
  const c = $('#clo_iframe_forms_include').is(':checked')
  c ? nuEnable('clo_iframe_forms') : nuDisable('clo_iframe_forms')
  nuSelectSelectAll('clo_iframe_forms', c)
}

function selectObjectPopuplated (formId, selectId, count) {
  if (selectId == 'clo_tabs') {
    nuSelectSelectAll('clo_tabs', true)
  }

  let chk
  if (selectId == 'clo_iframe_forms') {
    chk = $('#clo_iframe_forms_include')
    const c = chk.is(':checked')
    if (c) {
      nuSelectSelectAll('clo_iframe_forms', true)
    }
    count === 0 ? nuDisable('clo_iframe_forms_include') : nuEnable('clo_iframe_forms_include')
    if (count === 0) chk.prop('checked', false).change()
  }

  if (selectId == 'clo_subforms') {
    chk = $('#clo_subforms_include')
    const s = chk.is(':checked')
    if (s) {
      nuSelectSelectAll('clo_subforms', true)
    }
    count === 0 ? nuDisable('clo_subforms_include') : nuEnable('clo_subforms_include')
    if (count === 0) chk.prop('checked', false).change()
  }
}

function enableDisableCheckboxes () {
  const v = nuGetValue('clo_dump')
  if (v == '0') {
    nuSetValue('clo_sql_replace_into', 0)
    nuDisable('clo_sql_replace_into')
    nuSetValue('clo_new_pks', 1)
    nuDisable('clo_new_pks')
  } else {
    nuEnable('clo_new_pks')
    nuEnable('clo_sql_replace_into')
  }
}

if (nuFormType() == 'edit') {
  if (nuIsNewRecord()) {
    $('#clo_tabs').empty()
    $('#clo_subforms').empty()
    $('#clo_iframe_forms').empty()
  }

  enableDisableCheckboxes()

  // clo_dummy required to adjust correct popup width
  nuHide('clo_dummy')
  nuSelectRemoveEmpty()

  $('#clo_subforms').nuLabelOnTop(-18, 25)
  $('#clo_iframe_forms').nuLabelOnTop(-18, 25)
  $('#clo_tabs').nuLabelOnTop()

  $('#label_clo_subforms').prop('for', 'clo_subforms_include')
  $('#label_clo_iframe_forms').prop('for', 'clo_iframe_forms_include')

  cloSubformsChecked()
  cloIframeFormsChecked()

  setParentFormId()
  setDefaultValues()

  addRunButton()
  setTitle()

  nuHasNotBeenEdited()
}
