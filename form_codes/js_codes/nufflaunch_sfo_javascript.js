nuInit()

function nuInit () {
  $("[id$='ff_browse']").nuHide()
  $('.nuActionButton').nuHide()

  nuHide(['fastform_prefix', 'nuFFAvailableColumnsWord', 'check_nulog', 'nuFFAvailableColumns'])
  nuDisable('nuFFAvailableColumns')

  nuSelectRemoveMultiple()
  nuSelectRemoveEmpty('obj_sf000ff_type', '-1')
  nuSelectRemoveEmpty('fastform_type', '-1')
  nuMoveFieldPrefixToSubform()
  nuSetValue('fastform_type', 'browseedit')

  nuAddActionButton('nuRunPHPHidden', 'Build Fast Form', 'nuRunPHPHidden("RUNFF");')
  nuSetToolTip('fastform_table', nuTranslate('Either pick an existing table or enter a new table name.'), true)
  nuSubformEnableMultiPaste('obj_sf', '#obj_sf000ff_label')
  nuSetFFTypeOptionsColor('obj_sf000ff_type')

  nuSetFK()
  nuDisableLastFFRow()

  $('#fastform_type > option').each(function () {
    $(this).addClass('nu_' + this.value)
  })

  $('#fastform_prefix').on('click', function (e) {
    e.stopPropagation()
  })

  // Show all items again when clicking on the datalist arrow down button
  $('#fastform_table')
    .on('click', function (e) {
      const t = $(this)
      const inpLeft = t.offset().left
      const inpWidth = t.width()
      const clickedLeft = e.clientX
      const clickedInpLeft = clickedLeft - inpLeft
      const arrowBtnWidth = 12
      if ((inpWidth - clickedInpLeft) < arrowBtnWidth) {
        if (t.val() !== '') {
          t.val('')
        }
      }
    })

    .on('input', function () {
      nuSetFFTable()
      nuShowAvailableFields(false)

      const selectedOption = $('option[value="' + $(this).val() + '"]')
      if (selectedOption.length) {
        nuSetProperty('available_columns', $('#fastform_table').val())
        nuSetProperty('assigned_columns', '')

        $('#nuFFAvailableColumns').empty()
        nuAvailableColumnsSetLoading()
        nuRefreshSelectObject('nuFFAvailableColumns', '', true)
      }
    })

  $('#fastform_table').focus()
}

function nuNoStoreObject (text) {
  return ['Word', 'Subform', 'Image', 'HTML', 'Button'].indexOf(text) !== -1
}

function nuNoBrowseObject (text) {
  return ['Display', 'File', 'Multiselect'].indexOf(text) !== -1 || nuNoStoreObject(text)
}

function nuSetFFCheckboxes (type) {
  const checkboxes = $("[id$='ff_browse']:checkbox")
  if (type.startsWith('browse')) {
    const l = checkboxes.length
    checkboxes.each(function (index) {
      if (index !== l - 1 && !$(this).is('[data-nu-no-browse]')) {
        $(this).show()
      }
    })
  } else {
    checkboxes.hide()
  }
}

function nuOnFormTypeChanged () {
  const type = nuGetValue('fastform_type')

  $('#fastform_type').removeClass().addClass('nu_' + type)
  $('#fastform_table').nuShow(type !== 'launch')

  nuSetFFCheckboxes(type)

  $("[data-nu-field='ff_datatype']").nuShow(type !== 'launch')
  nuShow('title_obj_sfff_browse', type.startsWith('browse'))

  nuSetFK()
}

let tableExists = false

function nuSetFFTable () {
  tableExists = nuFORM.getTables().indexOf(nuGetValue('fastform_table')) !== -1

  $("[id$='ff_column_picker']")
    .prop('disabled', !tableExists)
    .toggleClass('nuReadonly', tableExists)

  nuShow(['fastform_prefix', 'check_nulog'], !tableExists)

  const c = $('#nuFFAvailableColumns')

  let l
  let rl
  let title = ''

  if (tableExists) {
    l = c.cssNumber('left') + c.cssNumber('width') + 30
    rl = '1473px'
    title = $('#obj_sf000ff_field').attr('title')
  } else {
    l = c.cssNumber('left')
  }

  $('#obj_sf').css('left', l)
  $('#ffwrd').css('left', l)
  $('#ff_resize').css('left', rl)
  $("[data-nu-field='ff_field']").attr('title', title)

  const bl = $("[id$='ff_browse']").length - 2
  $('#obj_sf' + nuPad3(bl) + 'ff_browse').hide()

  nuEnableFFDataType()
  nuSetFK()
}

function nuSetFK () {
  nuHide('fastform_fk')

  const table = nuGetValue('fastform_table')
  if (table !== '' && nuFORM.getTables().indexOf(table) == -1 && nuGetValue('fastform_type') == 'subform') {
    nuShow('fastform_fk')
  }
}

function nuShowFFO (e) {
  const t = $('#' + e.target.id).attr('data-nu-prefix')
  const i = nuGetValue(t + 'ff_id')
  const l = nuGetValue(t + 'ff_label')
  const f = nuGetValue(t + 'ff_field')
  const fff = 'fromfastform|' + f + '|' + l

  nuPopup('nuobject', i, fff)
}

function nuGetFFDataType (h) {
  let t = 'VARCHAR(1000)'

  if (h == 'Checkbox') t = 'VARCHAR(1)'
  if (h == 'Display') t = 'VARCHAR(50)'
  if (h == 'Lookup') t = 'VARCHAR(25)'
  if (h == 'Textarea') t = 'TEXT'
  if (h == 'Calc') t = 'DECIMAL'
  if (h == 'nuDate') t = 'DATE'
  if (h == 'File') t = 'LONGTEXT'
  if (h == 'nuAutoNumber') t = 'BIGINT UNSIGNED'
  if (h == 'Number') t = 'INT'
  if (h == 'nuNumber') t = 'DECIMAL(12,4)'
  if (h == 'Button' || h == 'HTML' | h == 'Image' || h == 'Word' || h == 'Subform') t = null

  return t
}

function nuEnableFFDataType () {
  $("[data-nu-field='ff_datatype']").not('.nuTabHolder').each(function () {
    const typeId = nuSubformRowObject(this.id, 'ff_type').attr('id')
    const sel = $('#' + typeId + ' option:selected').text()
    const noBrowse = nuNoBrowseObject(sel)

    $(this).nuEnable(sel !== '' && !tableExists && !noBrowse && nuFFFormType() !== 'launch')
    if (nuFFFormType() == 'launch') $(this).val('')
  })
}

function nuSetFFDataType (id, h) {
  const dataType = nuGetFFDataType(h)
  const noStoreObject = nuNoStoreObject(h)
  let t

  if (tableExists && !noStoreObject) {
    const index = nuSERVERRESPONSE.tableSchema[fastform_table.value].names.indexOf('cot_code')
    t = index !== -1 ? nuSERVERRESPONSE.tableSchema[fastform_table.value].types[index] : ''
  } else
  if (dataType !== null && !tableExists && !noStoreObject && nuFFFormType() !== 'launch') {
    t = dataType
  } else {
    t = ''
  }

  nuEnableFFDataType()
  $(id).val(t)
}

function nuFFFormType () {
  return nuGetValue('fastform_type')
}

function nuSelectFFObjects (e) {
  if ($('#fastform_table').val().trim() == '' && !nuFFFormType() == 'launch') {
    nuMessage(fastform_table.title)
    $('#fastform_table').focus()
    return
  }

  const id = e.target.id
  const rowno = nuPad3($("[id^='obj_sf'][id$='ff_label']", document).length - 1)
  const rowsuf = nuPad2(rowno)
  const sfrow = '#obj_sf' + rowno
  const h = String(e.target.innerHTML).split(':')
  const label = h[h.length - 1] + rowsuf

  nuSetPlaceholder(sfrow.substring(1) + 'ff_label', label)

  $(sfrow + 'ff_label').val(label).nuEnable().change()
  $(sfrow + 'ff_id').val(id)
  $(sfrow + 'ff_type').val(id).nuEnable()
  $(sfrow + 'ff_field').nuEnable().attr('data-nu-picked', true)
  $(sfrow + 'nuDelete').nuEnable()

  const r = $('#' + sfrow.substring(1) + 'ff_type')
  nuSetFFTypeColor(r[0])

  if (nuNoBrowseObject(e.target.innerHTML)) {
    $(sfrow + 'ff_browse').hide().attr('data-nu-no-browse', '')
  } else {
    $(sfrow + 'ff_browse').show().removeAttr('data-nu-no-browse')
  }

  $('#fastform_type').change()

  nuSetFFDataType(sfrow + 'ff_datatype', h)

  $(sfrow + 'ff_field').focus()
}

function nuOnChangeFFType (t, event) {
  const target = event.target
  const i = target.id

  const id = nuSubformRowObject(i, 'ff_id')
  const browse = nuSubformRowObject(i, 'ff_browse')
  const label = nuSubformRowObject(i, 'ff_label')
  const field = nuSubformRowObject(i, 'ff_field')
  const dataType = nuSubformRowObject(i, 'ff_datatype')
  const objType = nuSubformRowObject(i, 'ff_type')
  const typeText = $(target).find('option:selected').text()
  const number = $(label).attr('placeholder').justNumbers()

  nuSetPlaceholder(label.attr('id'), typeText + number)

  if (field.val() == '') {
    label.val(typeText + number)
  }

  id.val(t.value)

  const noStoreObj = nuNoStoreObject(typeText)
  if (noStoreObj || nuFFFormType() === 'launch') {
    $(browse).hide().attr('data-nu-no-browse', '').prop('checked', 0)
    nuSetValue(browse.id, true)
  } else {
    $(browse).show()
  }

  const objTypeText = nuGetValue($(objType).attr('id'), 'text')
  nuSetFFDataType('#' + $(dataType).attr('id'), objTypeText)

  nuEnableFFDataType()
  nuSetFFTypeColor(t)
}

function nuOnChangeFFField (t, event) {
  if (tableExists) {
    const i = nuSERVERRESPONSE.tableSchema[fastform_table.value].names.indexOf(t.value)
    const dataType = i === -1 ? '' : nuSERVERRESPONSE.tableSchema[fastform_table.value].types[i].toUpperCase()
    nuSubformRowObject(event.target.id, 'ff_datatype').val(dataType)
  }
}

let selectedField = null

function onColumnPicker (event) {
  const id = event.target.id
  if (id != '') {
    selectedField = nuSubformRowObject(id, 'ff_field')
    if ($(selectedField).attr('data-nu-picked')) {
      $("[id$='ff_field']").removeClass('nuHighlight')
      $(selectedField).addClass('nuHighlight')
    }
  }
}

function nuShowAvailableFields (v) {
  const ac = ['nuFFAvailableColumns', 'nuFFAvailableColumnsWord']
  if (!tableExists) {
    nuHide(ac)
    return
  }

  nuShow(ac)

  if (v) {
    const arr = nuSubformColumnArray('obj_sf', 'ff_field')
    arr.push('')
    disableFromSelect('nuFFAvailableColumns', arr)
    $('#nuFFAvailableColumns').prop('disabled', false).removeClass('nuReadonly')
  } else {
    if ($('#nuFFAvailableColumns option').not("[value='']").length !== 0) {
      $('#nuFFAvailableColumns').prop('disabled', true).addClass('nuReadonly')
    }
  }
}

function disableFromSelect (id, arrOptionsVal) {
  $('#nuFFAvailableColumns').children('option').attr('disabled', false)
  $('#' + id).find('option').filter(function () {
    return arrOptionsVal.indexOf(this.value) != -1
  }).attr('disabled', true)
}

function nuSelectObjectRefreshed (o, f, c) {
  if (c == 0) nuShowAvailableFields(false)
}

function nuMoveFieldPrefixToSubform () {
  const title = $('#title_obj_sfff_field')
  title.html(title.html() + '<br>')
  const prefix = $('#fastform_prefix')
  title.append(prefix)
  nuSetPlaceholder('fastform_prefix', 'Prefix', true)
  prefix.css({
    top: '1px',
    left: '0px',
    position: 'relative',
    'background-color': '#afe9ff'
  })
}

function nuSetLabel (field, label) {
  const i = field.indexOf('_')
  if (i == 2 || i == 3) {
    field = field.substring(i + 1)
  }

  label.val(field.replaceAll('_', ' ').capitalise().toTitleCase()).change()
}

function nuAvailableFieldsOnClick (event, t) {
  if (selectedField !== null) {
    const v = t.value
    $(selectedField).val(v).change()

    const label = $('#' + $(selectedField).attr('id').replace('field', 'label'))
    if (label.is('[data-user-modified]')) {
      const answer = window.confirm(nuTranslate('Overwrite the Label?'))
      if (!answer) return
    }

    nuSetLabel(v, label)

    nuSubformMoveFocus(selectedField, 1)
  }

  nuShowAvailableFields(true)
}

function nuGetStringAfterSubstring (parentString, substring) {
  return parentString.substring(parentString.indexOf(substring) + substring.length)
}

function nuAvailableColumnsSetLoading () {
  $('#nuFFAvailableColumns').prepend('<option disabled="disabled">' + nuTranslate('Loading') + '...' + '</option>')
}

function nuChangePrefix (prefix) {
  prefix = prefix.trim() === '' ? '' : prefix + '_'
  const fieldArr = nuSubformColumnArray('obj_sf', 'ff_field')

  for (let i = 0; i < fieldArr.length; i++) {
    const n = fieldArr[i].indexOf('_')
    if (n == -1 || n == 2 || n == 3) {
      const f = $('#obj_sf' + nuPad3(i) + 'ff_field')
      if (f.val() !== '') {
        f.val(prefix + nuGetStringAfterSubstring(f.val(), '_')).change()
      }
    }
  }
}

function nuDisableLastFFRow () {
  const l = nuSubformObject('obj_sf').rows.length

  const rowPrefix = '#obj_sf' + nuPad3(l == 1 ? 0 : l - 1)
  $(rowPrefix + 'ff_label').nuDisable()
  $(rowPrefix + 'ff_field').nuDisable()
  $(rowPrefix + 'ff_type').nuDisable()
  $(rowPrefix + 'ff_type').nuDisable()
  $(rowPrefix + 'ff_datatype').nuDisable()
}

function nuButtonClass (id) {
  return $('#' + id).attr('class').split(' ')[1]
}

function nuSetFFTypeOptionsColor (id) {
  $('#' + id + ' > option').each(function () {
    if (this.value !== '') {
      $(this).addClass($('#' + this.value).attr('class').split(' ')[1])
    }
  })
}

function nuSetFFTypeColor (t) {
  const x = '#' + t.value
  if (t.value !== '') {
    const id = $(x)
    $(t).removeClass().addClass(id.attr('class').split(' ')[1])
  }
}

function nuSetDataUserModified (t, event) {
  if ([37, 38, 39, 40, 9, 13].indexOf(event.keyCode) === -1) {
    $(t).attr('data-user-modified', '')
  }
}

function nuOnBlurFFLabel (t, event) {
  if (!tableExists) {
    const ff_field = nuSubformRowObject(event.target.id, 'ff_field')
    if (!ff_field.is('[data-user-modified]') && $(t).is('[data-user-modified]')) {
      const v = $(t).val()
      if (v !== '') {
        const prefix = $('#fastform_prefix').val()
        ff_field.val((prefix === '' ? '' : prefix + '_') + v.toLowerCase().replaceAll(' ', '_')).change()
      }
    }
  }
}

function nuOnBlurFFField (t, event) {
  let v = $(t).val().trim()
  if (v !== '') {
    const prefix = $('#fastform_prefix').val()
    if (!v.startsWith(prefix)) {
      v = prefix + '_' + v
      $(t).val(v)
    }

    const label = nuSubformRowObject(event.target.id, 'ff_label')
    if (!label.is('[data-user-modified]')) {
      nuSetLabel(v, label)
    }
  }
}

function nuClickDelete (event) {
  const id = event.target.id
  const sf = $('#' + id).attr('data-nu-checkbox')
  const row = id.substring(sf.length, sf.length + 3)
  const checked = $('#' + id).is(':checked')

  $('[id^=' + sf + nuPad3(row) + ']')
    .not(':button, :checkbox')
    .toggleClass('nuSubformDeleteTicked', checked)
    .toggleClass('nuReadonly', checked)
    .nuEnable(!checked)
}

function nuFFInvalidColumns () {
  let msg = ''
  const table = nuGetValue('fastform_table')

  if (nuFORM.getTables().indexOf(table) == -1) return ''

  const sf = nuSubformObject('obj_sf')
  for (let i = 0; i < sf.rows.length; i++) {
    const field = sf.rows[i][2]
    const type = nuGetValue('obj_sf' + nuPad3(i) + 'ff_type', 'text')
    const exists = nuFORM.tableSchema[table].names.indexOf(field)
    if (sf.deleted[i] != 1 && exists == -1 && !nuNoStoreObject(type)) {
      msg += nuTranslate('Invalid Field Name') + ' <b>' + field + '</b><br>'
    }
  }

  return msg
}

function nuBeforeSave () {
  const table = nuGetValue('fastform_table')
  const type = nuGetValue('fastform_type')
  const fk = nuGetValue('fastform_fk')

  if (table === '' && type !== 'launch') {
    nuMessage(['<b>' + nuTranslate('Table Name') + '</b> ' + nuTranslate('cannot be left blank')])
    return false
  }

  if (type === '') {
    nuMessage(['<b>' + nuTranslate('Form Type') + '</b> ' + nuTranslate('cannot be left blank')])
    return false
  }

  if (type.startsWith('browse') && $("[data-nu-field='ff_browse']:checked").length === 0) {
    nuMessage([nuTranslate('At least 1 Browse needs to be checked')])
    return false
  }

  const fieldArr = nuSubformColumnArray('obj_sf', 'ff_field')
  if (fieldArr.includes('') || !nuArrayIsUnique(fieldArr)) {
    nuMessage(nuTranslate('The Field Names must be both unique and not blank'))
    return false
  }

  const pk = table + '_id'
  if (fieldArr.includes(pk)) {
    nuMessage(nuTranslate('The Primary Key %s must not be entered.').replace('%s', '<b>' + pk + '</b>'))
    return false
  }

  if (type === 'subform' && table !== '' && nuFORM.getTables().indexOf(table) === -1 && fk === '') {
    nuMessage(['<b>' + nuTranslate('Foreign Key Field Name') + '</b> ' + nuTranslate('cannot be left blank')])
    return false
  }

  const a = []
  for (let i = 0; i < nuSubformObject('obj_sf').rows.length; i++) {
    a.push(nuSubformObject('obj_sf').rows[i][2])
  }

  if (fk !== '' && a.indexOf(fk) > -1 && type === 'subform') {
    nuMessage(['<b>' + nuTranslate('Foreign Key Field Name') + '</b> ' + nuTranslate('is already used')])
    return false
  }

  if (nuGetValue('obj_sf000ff_field') == '') {
    nuMessage(nuTranslate(' At least one Field must be specified'))
    return false
  }

  const invalidColumns = nuFFInvalidColumns()
  if (invalidColumns !== '') {
    nuMessage(invalidColumns)
    return false
  }

  return true
}
