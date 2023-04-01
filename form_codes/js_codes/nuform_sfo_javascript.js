function colorObjectTypes () {
  // Color Types
  $('select[id$=sob_all_type]').find('option').each(function (index, element) {
    $(element).addClass('nu_' + element.value)
  })

  $('select[id$=sob_all_type]').each(function (index, element) {
    $(element).removeClass()
    $(element).addClass('nu_' + element.value)
  })
}

function nuSetControlsVisibility () {
  const pb = 'previewbrowse'
  const pe = 'previewedit'
  const js = 'sfo_javascript'

  const bb = 'bb_event'
  const be = 'be_event'
  const bs = 'bs_event'
  const as = 'as_event'
  const bd = 'bd_event'
  const ad = 'ad_event'

  nuEnable([pb, pe, bb, be, bs, as, bd, ad, js])

  const t = String($('#sfo_type').val())

  if (t == 'browseedit') {
    nuEnable(['js_edit', 'js_browse', 'js_browse_edit'])
  } else
  if (t == 'browse') {
    nuDisable([pe, be, bs, as, bd, ad, 'js_edit'])
    nuEnable(['js_browse', 'js_browse_edit'])
  } else
  if (t == 'edit') {
    nuDisable([pb, pb, bb, 'js_browse'])
    nuEnable(['js_edit', 'js_browse_edit'])
  } else
  if (t == 'launch') {
    nuDisable([pb, bb, bs, as, bd, ad, 'js_browse', 'js_edit'])
    nuEnable('js_browse_edit')
  } else
  if (t == 'subform') {
    nuDisable([pb, bb, be, bs, as, bd, ad, js, 'js_browse', 'js_edit', 'js_browse_edit'])
    $('#js_browse_edit').html('Launch')
  }

  for (let i = 1; i <= 3; i++) {
    nuShow('nuTab' + i, t !== 'subform' || i == 1)
  }
}

function afterinsertrowObjects () {
  colorObjectTypes()
}

function JsMod (i) {
  const js = $('#' + i)

  if (js.val() !== '') {
    $('#nuTab2').css('font-weight', 'bold')
  }

  js.addClass('js')
}

if (nuFormType() == 'edit') {
  $('#sfo_code_snippet_sql_lookupbutton').on('click', function () {
    nuSetSnippetFormFilter(0, 0, 1, 0) // Custom Code
  })

  $('#sfo_code_snippet_lookupbutton').on('click', function () {
    nuSetSnippetFormFilter(1, 0, 0, 0) // SQL
  })

  colorObjectTypes()

  $('#title_objformbtnOpenDetails').html(nuTranslate('Details'))

  nuHide('sfo_code_snippet_lookupcode')
  nuHide('sfo_code_snippet_sql_lookupcode')
  nuHide('label_sfo_browse_sql')

  nuSetPlaceholder('sfo_javascript', 'JavaScript')
  nuSetPlaceholder('sfo_browse_javascript', 'JavaScript')
  nuSetPlaceholder('sfo_edit_javascript', 'JavaScript')

  $('#title_zzzzsys_tab_sfsyt_help').attr('id', 'help_title')
  $("[id$='syt_help']").addClass('js')

  nuAttachButtonImage('previewbrowse', 'PB', 'nuButtonImageSmall')
  nuAttachButtonImage('previewedit', 'PE', 'nuButtonImageSmall')
  nuAttachButtonImage('bb_event', 'BB', 'nuButtonImageSmall')
  nuAttachButtonImage('be_event', 'BE', 'nuButtonImageSmall')
  nuAttachButtonImage('bs_event', 'BS', 'nuButtonImageSmall')
  nuAttachButtonImage('as_event', 'AS', 'nuButtonImageSmall')
  nuAttachButtonImage('bd_event', 'BD', 'nuButtonImageSmall')
  nuAttachButtonImage('ad_event', 'AD', 'nuButtonImageSmall')
  nuAttachButtonImage('icon_js', 'JS')
  nuAttachButtonImage('icon_sql', 'SQL')
  nuAttachButtonImage('icon_php', 'PHP')
  nuAttachButtonImage('icon_style', 'CSS')

  JsMod('sfo_edit_javascript')
  JsMod('sfo_browse_javascript')
  JsMod('sfo_javascript')

  nuHide('sfo_edit_javascript')
  nuHide('sfo_browse_javascript')
  nuHide('sfo_style')

  $('#sfo_style').addClass('css')

  $('#sfo_browse_sql').addClass('sql').css('font-size', 10)

  if (!nuIsNewRecord()) {
    nuUpdateAclCount()
  }

  default_description()

  // Add ACE event handlers
  $('.js').dblclick(function () {
    nuOpenAce('JavaScript', this.id)
  })

  $('.sql').dblclick(function () {
    nuOpenAce('SQL', this.id)
  })

  $('.html').dblclick(function () {
    nuOpenAce('HTML', this.id)
  })

  $('.css').dblclick(function () {
    nuOpenAce('CSS', this.id)
  })

  nuUpdateDisplayDatalists()

  nuTypeChanged()

  const js = nuGetProperty('js')
  if (js !== undefined) {
    const js_button = nuGetProperty('js_button')
    nuJSSelectCustomCode('#' + js_button, js)
  } else {
    if ($('#sfo_javascript').val() == '' && $('#sfo_edit_javascript').val() == '' && $('#sfo_browse_javascript').val() !== '') {
      nuJSSelectCustomCode('#js_browse', 'sfo_browse_javascript')
    } else if ($('#sfo_javascript').val() == '' && $('#sfo_browse_javascript').val() == '' && $('#sfo_edit_javascript').val() !== '') {
      nuJSSelectCustomCode('#js_edit', 'sfo_edit_javascript')
    } else {
      nuJSSelectCustomCode('#js_browse_edit', 'sfo_javascript')
    }
  }

  nuHighlightJSButtons()
} else { // FormType() = browse
  $("[data-nu-column='1']").each(function () {
    $(this).addClass('nu_' + this.textContent)
  })

  // Adjust Padding-Top for Preview Button
  $("[data-nu-column='0']").each(function () {
    $(this).css('padding-top', '2px')
  })

  addRowButtons(0)
}

if (window.filter == 'justjs') {
  $('#nuDeleteButton').remove()
  $('#nuCloneButton').remove()
  $('#nuTab0').remove()
  $('#nuTab1').remove()
  $('#nuTab2').click()
  $('#nuTab2').remove()

  nuSetTitle($('#sfo_description').val())
}

$('#user_home')
  .css({
    color: 'white',
    'font-size': 13,
    display: 'inline',
    'border-style': 'solid',
    height: 30,
    'text-shadow': '0 1px 2px #9AB973',
    'border-color': '#9AB973',
    'border-width': '0px 0px 1px 0px',
    'background-color': '#88cb51'
  })

function nuTypeChanged () {
  let t = String($('#sfo_type').val())

  const pb = 'previewbrowse'
  const pe = 'previewedit'

  const bb = 'bb_event'
  const be = 'be_event'
  const bs = 'bs_event'
  const as = 'as_event'
  const bd = 'bd_event'
  const ad = 'ad_event'

  nuEnable([pb, pe, bb, be, bs, as, bd, ad])

  if (t == 'browse') {
    nuDisable([pe, be, bs, as, bd, ad])
  } else
  if (t == 'edit') {
    nuDisable([pb, pb, bb])
  } else
  if (t == 'launch') {
    nuDisable([pb, bb, bs, as, bd, ad])
  } else
  if (t == 'subform') {
    nuDisable([pb, bb, be, bs, as, bd, ad])
    nuDisable('sfo_javascript')
  }

  const h = $('#sfo_type').addClass('nuEdited')

  const o = []
  o.browse = [0, 1, 2]
  o.edit = [0, 2]
  o.browseedit = [0, 1, 2]
  o.launch = [0, 2]
  o.subform = [0, 1]

  $('#sfo_type').removeClass()
  $('#sfo_type').addClass('nu_' + $('#sfo_type').val())

  if (h) {
    $('#sfo_type').addClass('nuEdited')
  }

  $('#sfo_type > option').each(function () {
    $(this).addClass('nu_' + this.value)
  })

  for (var i = 0; i < 7; i++) {
    $('#nuTab' + i).removeClass('nuRelatedTab')
  }

  t = o[$('#sfo_type').val()]
  if (t !== undefined) {
    for (i = 0; i < t.length; i++) {
      $('#nuTab' + t[i]).addClass('nuRelatedTab')
    }
  }

  nuSetControlsVisibility()
}

function nuEventList () {
  if ($('sob_all_type').val() == 'subform') {
    return ['onchange', 'onadd']
  } else {
    return ['onblur', 'onchange', 'onfocus', 'onkeydown']
  }
}

function onDisplayBlur (event) {
  const id = event.target.id

  let obj
  obj = nuSubformRowObject(id, 'sbr_display')
  let dispValue = obj.val()
  if (dispValue !== '' && (dispValue.charAt(3) == '_' || dispValue.charAt(2) == '_')) {
    const idx = dispValue.indexOf('_')
    if (idx == 2 || idx == 3) {
      dispValue = dispValue.substring(idx + 1)
    }

    const title = dispValue.replaceAll('_', ' ').capitalise().toTitleCase()

    const objTitle = nuSubformRowObject(id, 'sbr_title')
    if (objTitle.val() == '') objTitle.val(title).change()
  }
}

function onTitleDisplayChanged (event) {
  let obj
  const id = event.target.id

  if (nuSubformRowObject(id, 'sbr_display').val().trim() == '' && nuSubformRowObject(id, 'sbr_title').val().trim()) return

  obj = nuSubformRowObject(id, 'sbr_width')
  if (obj.val() == '') obj.val(100).change()

  obj = nuSubformRowObject(id, 'sbr_align')
  if (obj.prop('selectedIndex') < 2) obj.prop('selectedIndex', 1).change()

  obj = nuSubformRowObject(id, 'sbr_order')
  if (obj.val() == '') {
    let max = 0
    $('[data-nu-field=sbr_order]').each(function () {
      const v = parseInt($(this).val())
      max = (v > max) ? v : max
    })

    obj.val(max + 10).change()
  }
}

function onTabsTitleChanged (event) {
  let obj
  const id = event.target.id

  if (nuSubformRowObject(id, 'syt_title').val().trim() == '' && nuSubformRowObject(id, 'syt_title').val().trim()) return

  obj = nuSubformRowObject(id, 'syt_order')
  if (obj.val() == '') {
    let max = 0
    $('[data-nu-field=syt_order]').each(function () {
      const v = parseInt($(this).val())
      max = (v > max) ? v : max
    })

    obj.val(max + 10).change()
  }
}

function default_description () {
  const s = 'zzzzsys_browse_sf'
  const r = nuSubformObject(s).rows.length - 1
  const o = s + nuPad3(r) + 'sbr_title'

  nuSetPlaceholder(o, 'Something')
}

function nuUpdateAclCount () {
  const l = $("[data-nu-field='slf_zzzzsys_access_id']").length - 2
  const t = l <= 0 ? '' : ' (' + l + ')'
  $('#nuTab3').html(nuTranslate('Access Levels') + t)
}

if (nuFormType() == 'browse') {
  if (!nuMainForm()) { // Hide Preview
    nuSetBrowseColumnSize(0, 0)
  }

  $("[data-nu-column='1']").addClass('nuCellColored')
}

function createButton (target, pk, formType) {
  const btn = $("<button id='nuPreviewButton' type='button' data-form-type='" + formType + "' class='nuActionButton'><i class='fa fa-search'></i>&nbsp;</button>")

  $(target).html(btn).attr('title', nuTranslate('Preview Form'))
  btn.on('click', function (e) {
    e.stopPropagation()
    const ft = $(this).attr('data-form-type')
    const r = ft == 'launch' || ft == 'edit' || ft == 'subform' ? '-1' : ''
    nuForm(pk, r, '', '')
  })
}

function addRowButtons (column) {
  $("[data-nu-column='" + column + "']").each(function (index) {
    const pk = $(this).attr('data-nu-primary-key')
    const r = $(this).attr('data-nu-row')
    const formType = $('#nucell_' + r + '_1').html()

    if (typeof pk !== 'undefined') {
      createButton(this, pk, formType)
    }
  })
}

function nuUpdateDisplayDatalists (i) {
  const a = nuFORM.SQLFields($('#sfo_browse_sql').val())

  const selector = i === undefined ? "[id$='sbr_display']" : '#' + i

  $(selector).each(function () {
    nuAddDatalist($(this).attr('id'), a)
  })
}

function nuBeforeSave () {
  const dupDisplay = nuSubformColumnUnique('zzzzsys_browse_sf', 'sbr_display', 'Display (Browse)')

  if (dupDisplay !== true) {
    nuMessage(dupDisplay)
    return false
  }

  return true
}

function nuJSSelectCustomCode (t, obj) {
  $('[data-custom-code-textarea-button]').removeClass('nuButtonSelected')
  $(t).addClass('nuButtonSelected')
  nuSetProperty('js', obj)
  nuSetProperty('js_button', $(t).attr('id'))

  $('[data-custom-code-textarea]').nuHide()
  nuShow(obj)

  nuHighlightJSButtons()
}

function nuHighlightJSButtons () {
  $('#js_edit').toggleClass('nuButtonHighlighted', $('#sfo_edit_javascript').val() !== '')
  $('#js_browse').toggleClass('nuButtonHighlighted', $('#sfo_browse_javascript').val() !== '')
  $('#js_browse_edit').toggleClass('nuButtonHighlighted', $('#sfo_javascript').val() !== '')
  $('#css_style').toggleClass('nuButtonHighlighted', $('#sfo_style').val() !== '')
}
