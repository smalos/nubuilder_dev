if (!nuDevMode()) {
  nuHideTabById('nu61e9964c9bf5e13') // JSON
}

// Code Snippets form
nuSetSnippetFormFilter(0, 0, 1, 0) // SQL

nuHide('sob_code_snippet_display_lookupcode')
nuHide('sob_code_snippet_select_lookupcode')
nuHide('label_zzzzsys_event_sf')
nuHide('label_sob_html_code')
nuShow('sob_run_zzzzsys_form_open_button', sob_run_zzzzsys_form_id.value !== '')
nuShow('sob_lookup_zzzzsys_form_open_button', sob_lookup_zzzzsys_form_id.value !== '')
nuDisplayInputIcon()

nuDisable('sob_calc_formula')
nuSetToolTip('sob_all_id_create_button', nuTranslate('Add database column'))

window.parentTabs = parent.$('.nuTab')

const tabIdDescLeft = $('#sob_all_zzzzsys_tab_iddescription').cssNumber('left') + 11
$('#sob_all_zzzzsys_tab_iddescription').css('left', tabIdDescLeft + 'px')

$('#zzzzsys_event_sfsev_javascript').attr('id', 'jsfuntitle')
$('#sob_calc_formula').addClass('nuCalculatorCurrency').css('font-size', 12)
$('#sob_all_display_condition').addClass('sql')
$('#sob_all_default_value_sql').addClass('sql')
$('#sob_display_sql').addClass('sql')
$('#sob_input_datalist').addClass('sql')
$('#sob_select_sql').addClass('sql')
$('#sob_lookup_javascript').addClass('js')
$('#sob_input_javascript').addClass('js')
$('#sob_html_javascript').addClass('js')
$('#sob_lookup_php').addClass('php')
$('#sob_html_code').addClass('html')
$('#sob_all_style').addClass('css')
$('#sob_input_attribute').addClass('css')
$("[id$='sev_javascript']").addClass('js')
$('#title_zzzzsys_event_sfsev_javascript').removeClass('js')
$('#sob_run_zzzzsys_form_open_button').toggleClass('input_button nuButton nuLookupButton')
$('#sob_lookup_zzzzsys_form_open_button').toggleClass('input_button nuButton nuLookupButton')
$('#sob_subform_zzzzsys_form_open_button').toggleClass('input_button nuButton nuLookupButton')
$('#sob_all_type_open_button').toggleClass('input_button nuButton nuLookupButton')

nuPreviewIcon('sob_input_icon_preview_html', nuGetValue('sob_input_icon'))

const placeholderText = `1. SQL: A valid SQL query that returns 2 columns:
SELECT table_id, description FROM table

Or:

2. List: A list delimited by a |:
1|First|
2|Second|
3|Third

Or:

3. JSON/Array: if both the display and the bound value are identical:

["value1", "value1", "value1"]
`

$('#sob_select_sql').focus(function () {
  $(this).prop('placeholder', placeholderText)
}).blur(function () {
  $(this).prop('placeholder', '')
})

$('#nuTab8').click(function () {
  nuTestChart()
})

nuAttachButtonImage('icon_lujs', 'LUJS')
nuAttachButtonImage('icon_html', 'HTML')
nuAttachButtonImage('ab_event', 'AB', 'nuButtonImageSmall')
// nuAttachButtonImage('di_sql', 'SQL','nuButtonImageSmall');
// nuAttachButtonImage('se_sql', 'SQL','nuButtonImageSmall');

$('#viewflowchart')
  .css('padding', '46px 0px 0px 3px')
  .css('text-align', 'left')
  .css('background-size', '75px')

if ($('#zzzzsys_event_sf000sev_event').val() !== '') {
  $('#nuTab10').css('font-weight', 'bold')
}

nuInputTypeChanged(nuGetValue('sob_input_type'))
nuHideCalcObjects()
nuPopulateHTML()
nuAddDataListToRunId()

$("button[id*='_btn_']").addClass('nuQuickButton').removeClass('input_button nuButton')

const filter = String(window.filter).split('|')

if (filter[0] == 'fromfastform') {
  $('#nuDeleteButton').remove()
  $('#nuCloneButton').remove()
  $('#nuSaveButton').remove()
  $('#sob_all_id').val(filter[1]).addClass('nuHighlight')
  $('#sob_all_label').val(filter[2]).addClass('nuHighlight')
}

$('.js').dblclick(function () {
  nuOpenAce('JavaScript', this.id)
})
$('.sql').dblclick(function () {
  nuOpenAce('SQL', this.id)
})
$('.html').dblclick(function () {
  nuOpenAce('HTML', this.id)
})
$('.php').dblclick(function () {
  nuOpenAce('PHP', this.id)
})
$('.css').dblclick(function () {
  nuOpenAce('CSS', this.id)
})

nuHide('sob_input_format')
const sit = nuGetValue('sob_input_type')
nuShow('sob_input_format', sit == 'nuDate' || sit == 'nuNumber')
nuShow('sob_input_javascript', sit == 'nuScroll')

nuObjectColor()
nuGetStartingTab()

if (!nuIsNewRecord()) {
  nuMaximiseParentifDragOptionsBox()
  nuDisplayIncHeightButtons()
  nuShowDataType()
} else {
  nuSetValue('sob_all_top', 0)
  nuSetValue('sob_all_left', 60)
  nuSetValue('sob_all_height', 22)
  nuSetValue('sob_all_width', 100)
  nuSetValue('sob_all_validate', 0)
  nuSetValue('sob_all_access', 0)
  nuSetValue('sob_all_align', 'left')
  nuSetValue('sob_all_cloneable', '1')

  nuHide('sob_all_type_open_button')
  nuHide('sob_all_type_input')
  nuHide('sob_all_id_create_button')

  if (nuIsIframe()) {
    const pTab = nuSelectedTabId(parent)
    if (pTab !== null) {
      nuGetLookupId(pTab, 'sob_all_zzzzsys_tab_id', false)
    } else {
      if (nuGetValue('sob_all_zzzzsys_tab_id') === '' && parent.nuCurrentProperties().form_code == 'nuuserhome') {
        nuGetLookupId('nufastforms', 'sob_all_zzzzsys_tab_id', false)
      }
    }
    $('#sob_all_label').focus()
    nuSetValue('sob_all_type', 'input')
    nuSetValue('sob_input_type', 'text')
  }
}

nuUpdateLookupDescriptionDatalist()
nuUpdateIdDatalist()
runMethodChanged()
nuHasNotBeenEdited()

function nuMaximiseParentifDragOptionsBox () {
  const db = parent.parent.$('.nuDragOptionsBox')
  if (db.length === 0) return

  const dd = db.parent() // nuDragDialog
  const l	= parseInt(dd.css('left'), 10)

  if (l == 2) return // already maximised

  const dt = db.nextAll('.nuDialogTitle').find('#dialogTitleWords')
  if (dt.length !== 0) {
    const e = { target: { id: 'dialogTitleWords' } }
    parent.parent.nuResizeWindow(e)
  }
}

function nuColumnDataType (table, id) {
  const s = nuFORM.tableSchema[table]
  let i = -1
  if (typeof s !== 'undefined') {
    i = s.names.indexOf(id.val())
  }

  return i > -1 ? s.types[i] : ''
}

function nuShowDataType () {
  const id = $('#sob_all_id')
  const iDataType = $('#sob_all_id_datatype')

  const table = nuGetValue('sob_all_table')
  let dataType = ''

  if (table !== '' && id.val() !== '') {
    dataType = nuColumnDataType(table, id)
  }

  iDataType.val(dataType)
  nuDisplayCreateButton()
}

function nuObjectNoId () {
  return ['word', 'html', 'button', 'run', 'subform', 'contentbox'].indexOf(nuGetValue('sob_all_type')) !== -1
}

function nuDisplayCreateButton () {
  const dataType = nuColumnDataType(nuGetValue('sob_all_table'), $('#sob_all_id'))
  nuShow('sob_all_id_create_button', dataType === '' && nuGetValue('sob_all_id') !== '' && nuGetValue('sob_all_table') !== '' && !nuObjectNoId())
}

function nuDisplayIncHeightButtons () {
  const showButtons = ['html', 'textarea', 'subform', 'image', 'contentbox'].indexOf(nuGetValue('sob_all_type')) !== -1

  $('[id^=sob_height_btn_set]').nuShow(showButtons)
}

function nuTestChart () {
  const g = nuGetValue('sob_html_chart_type')

  if (g === '' || nuGetValue('sob_all_type') !== 'html') {
    $('#google_chart').html('')
    return
  }

  let c = 'ComboChart'
  const t = nuGetValue('sob_html_title')
  const x = nuGetValue('sob_html_vertical_label')
  const y = nuGetValue('sob_html_horizontal_label')
  let l = 'bars'
  let s = false

  const a = [
    ['Month', 'Shane', 'Dave', 'Adam', 'Paul', 'Chris'],
    ['2019', 100, 200, 300, 400, 500],
    ['2020', 165, 238, 322, 498, 550],
    ['2021', 165, 938, 522, 998, 450],
    ['2022', 135, 1120, 599, 1268, 288]
  ]

  if (g == 'p') c = 'PieChart'
  if (g == 'l') l = 'lines'
  if (g == 'bh') c = 'BarChart'
  if (g == 'bhs') c = 'BarChart'
  if (g == 'bs') s = true
  if (g == 'bhs') s = true

  nuChart('google_chart', c, a, t, x, y, l, s)
}

function nuChartOnReady (i, wrapper) {
  // let wrapper = window["google_chart_wrapper"];
  const options = { seriesType: wrapper.m.seriesType, chartArea: { left: '10%', width: '65%' } }
  wrapper.setOptions(options)
  wrapper.draw()
}

function nuAddDataListToRunId () {
  const arrRecordId = [
    ['     ', nuTranslate('Leave blank to open a Browse or Launch Form')],
    ['-1', nuTranslate('Open a new Record')],
    ['#EXAMPLE_HASH_COOKIE#', nuTranslate('Use a Hash Cookie')]
  ]

  nuAddDatalist('sob_run_id', arrRecordId)

  $('#sob_run_id').on('input', function () {
    if ($(this).val() == '     ') {
      $(this).val('').change()
    }
  })
}

function nuObjectColor () {
  $('.nuValidate').removeClass('nuValidate')

  const e = $('#sob_all_type').hasClass('nuEdited')
  const o			= []

  o.run		= 1
  o.display	= 2
  o.select	= 3
  o.lookup	= 4
  o.subform	= 5
  o.image		= 6
  o.input		= 7
  o.html		= 8
  o.calc		= 9

  $('#sob_all_type').removeClass()

  if (e) { // -- keep class if edited
    $('#sob_all_type').addClass('nuEdited')
  }

  $('#sob_all_type').addClass('nu_' + $('#sob_all_type').val())

  $('#sob_all_type > option').each(function () {
    $(this).addClass('nu_' + this.value)
  })

  const t = o[$('#sob_all_type').val()]

  $("[id^='nuTab']").removeClass('nuRelatedTab')

  for (let i = 1; i < o.length; i++) {
    $('#nuTab' + i).removeClass('nuRelatedTab')
  }

  $('#nuTab0').addClass('nuRelatedTab')
  $('#nuTab' + t).addClass('nuRelatedTab')
}

function nuDisplayAllTypeInput () {
  let v = nuGetValue('sob_input_type', 'text')
  v = nuGetValue('sob_all_type') == 'input' ? v : ''
  $('#sob_all_type_input').val(v)
}

function nuTypeChanged () {
  nuShow('sob_all_type_open_button', sob_all_type.value !== '')
  nuShow('sob_all_type_input', sob_all_type.value !== '')

  nuObjectColor()
  nuDisplayCreateButton()
  nuDisplayIncHeightButtons()
  nuDisplayAllTypeInput()
  nuDisplayInputIcon()
}

function nuInputTypeChanged (t) {
  nuHide('sob_input_format')
  nuHide('sob_input_count')
  nuHide('sob_input_javascript')
  nuHide('sob_input_datalist')
  nuHide('sob_input_file_target')

  if (t == 'nuScroll') {
    nuShow('sob_input_javascript')
  }

  if (t == 'file') {
    nuShow('sob_input_file_target')

    if (nuGetValue('sob_input_file_target') == '') {
      nuSetValue('sob_input_file_target', '0')
    }

    addFileUploadScript()
  }

  if (t == 'nuAutoNumber') {
    nuShow('sob_input_count')
    $('#sob_input_javascript').val('').addClass('nuEdited')
  }

  if (t == 'nuDate' || t == 'nuNumber' || t == 'number' || t == 'text' || t == 'email' || t == 'search' || t == 'month') {
    nuShow('sob_input_datalist')
    if ($('#sob_input_datalist').val() == '' && $('#sob_all_id_datatype').val() !== '') {
      //   $('#sob_input_datalist').val("SELECT DISTINCT `" + $("#sob_all_id").val() + "` FROM `" + $('#sob_all_table').val() + "` ORDER BY 1").change();
    }
  }

  if (t == 'nuDate' || t == 'nuNumber') {
    nuShow('sob_input_format')

    $('#sob_input_format').children().each(function (index) {
      $(this).show()

      if ($(this).val()[0] == 'D' && t != 'nuDate') {
        $(this).hide()
      }
      if ($(this).val()[0] == 'N' && t != 'nuNumber') {
        $(this).hide()
      }
    })
  }

  nuDisplayInputIcon()
  nuDisplayAllTypeInput()
}

function nuDisplayInputIcon () {
  nuShow('sob_input_icon', sob_input_type.value == 'button' || sob_all_type.value == 'run' || sob_all_type.value == 'word')
}

function nuHideCalcObjects () {
  const f = $('#sob_all_zzzzsys_form_id').val()

  $('#add_total').children().each(function (index) {
    if ($(this).val() != f) {
      $(this).hide()
    }
    if ($(this).text() == $('#sob_all_id').val()) {
      $(this).hide()
    }
  })
}

function nuInsertOrAppendToCalcFormula (oldValue, newValue) {
  const manualMode = nuGetValue('sob_calc_formula_edit_mode_checkbox')
  if (manualMode) {
    nuInsertAtCaret('sob_calc_formula', newValue)
  } else {
    nuSetValue('sob_calc_formula', oldValue + newValue)
  }
}

function nuAddCalcObject (t) {
  const i = $(t).attr('data-nu-ids')
  const oldValue = $('#sob_calc_formula').val()
  const newValue = "nuTotal('" + i + "')"

  if (i == '') {
    return
  }

  $('#sob_calc_formula').addClass('nuEdited')

  nuInsertOrAppendToCalcFormula(oldValue, newValue)

  $('#add_total').val('')

  nuHasBeenEdited()
}

function nuAddToFormula (e) {
  const newValue = e.target.innerHTML
  const oldValue = $('#sob_calc_formula').val()

  if (newValue == 'Clear') {
    $('#sob_calc_formula')
      .val('')
      .addClass('nuEdited')
    return
  }

  $('#sob_calc_formula').addClass('nuEdited')

  nuInsertOrAppendToCalcFormula(oldValue, newValue)

  nuHasBeenEdited()
}

function nuPopulateHTML () {
  const o = nuCalcObjects()
  const a = []

  for (let i = 0; i < o.length; i++) {
    const ids = String(o[i].ids)
    const ty = o[i].type
    const id = String(o[i].ids).split('.')
    const sp = '&nbsp;'

    if (id.length == 1) {
      a.push('<tr><td><div title="' + ty + '" style="overflow:hidden;width:305px;text-align:left;padding:2px" onclick="nuAddCalcObject(this);" class="nuCalculatorButton nu_' + o[i].type + '" data-nu-ids="' + ids + '">' + ids + '</div></td></tr>')
    } else {
      const h = '<span title="subform" class="nu_subform">' + id[0] + '</span>.<span title="' + ty + '" class="nu_input" style="padding:7px 5px 7px 5px">' + id[1] + sp.repeat(200) + '</span>'
      a.push('<tr><td><div style="overflow:hidden;width:305px;text-align:left;padding:2px;height:28px" onclick="nuAddCalcObject(this);" class="nuCalculatorButton nu_subform" data-nu-ids="' + ids + '">' + h + '</div></td></tr>')
    }
  }

  $('#add_total').html('<table>' + a.join('') + '</table>')
}

function nuSetSelectIndex (i, index) {
  $('#' + i).prop('selectedIndex', index).change()
}

function nuSetLookupWidth () {
  const w = $('#sob_lookup_description').val() == $('#sob_lookup_code').val() ? 0 : 150
  const cw = $('#sob_lookup_description_width').val()
  if (cw == 0 || cw == 150 || w == 0) $('#sob_lookup_description_width').val(w).change()
}

function subFormRowsCount (subform, fieldname) {
  const sf = nuSubformObject(subform)
  const col = sf.fields.indexOf(fieldname)
  let c = 0
  for (let row = 0; row < sf.rows.length; row++) {
    if (sf.deleted[row] == 0 && sf.rows[row][col].trim() != '') c++
  }

  return c
}

function nuBeforeSave () {
  runMethodChanged()
  adjustProperties()

  if ($('#sob_all_type').val() == 'select') {
    $('#sob_select_multiple').addClass('nuEdited')
  }

  $('#sob_all_event').prop('checked', subFormRowsCount('zzzzsys_event_sf', 'sev_event') > 0).change()
}

function adjustProperties () {
  const type = nuGetValue('sob_all_type')
  const access = nuGetValue('sob_all_access')
  const validation = nuGetValue('sob_all_validate')
  const inputType = nuGetValue('sob_input_type')
  const inputFormat = nuGetValue('sob_input_format')

  if (type !== 'input') {
    if (inputType !== '') nuSetValue('sob_input_type', '')
    if (inputFormat !== '') nuSetValue('sob_input_format', '')
  }

  if (type.containsAny(['word', 'html', 'image', 'contentbox', 'contentbox'])) {
    if (validation !== '0') nuSetValue('sob_all_validate', '0') // validation --> none
    if (access == '1') nuSetValue('sob_all_access', '0') // readonly --> editable
  }

  if (type === 'word') {
    if (access == '1') nuSetValue('sob_all_access', '0') // readonly --> editable
    if (validation !== '0') nuSetValue('sob_all_validate', '0') // validation --> none
    nuSetValue('sob_input_type', '')
    nuSetValue('sob_input_format', '')
  }

  if (type === 'display') {
    if (access == '1') nuSetValue('sob_all_access', '0') // readonly --> editable
  }
}

function runMethodChanged () {
  const m = nuGetValue('sob_run_method')
  nuEnable('sob_run_target', m == 'b')

  if ($('#sob_run_target').prop('selectedIndex') > 0 && m == 'b') {
    return
  }

  if (m == 'b' || m == 'i') {
    $('#sob_run_target').prop('selectedIndex', m == 'b' ? 1 : 0).change()
  }
}

function nuOnClone () {
  nuHide('sob_all_id_create_button')
}

function nuUpdateIdDatalist () {
  const t = nuFORM.tableSchema[nuGetValue('sob_all_table')]
  nuAddDatalist('sob_all_id', typeof t !== 'undefined' ? t.names : [])
}

function nuUpdateLookupDescriptionDatalist () {
  const arr = nuFORM.tableSchema[nuGetValue('sob_lookup_table')] ? nuFORM.tableSchema[nuGetValue('sob_lookup_table')].names : []
  nuAddDatalist('sob_lookup_description', arr)
}

function setJSON () {
  const data = {

    	 type: {

    		 version: '1.0',
    		 mobile: {
    		    version: '1.0',
    			name: 'test1',
    			visible: true,
    			location: {
    				top: sob_all_top.value,
    				left: sob_all_left.value
    			},
    			size: {
    				width: sob_all_width.value,
    				height: sob_all_height.value
    			},
    			class: ['nuMobileInput']
    		}
    	}

  }

  const obj = JSON.stringify(data)
  nuSetValue('sob_all_json', obj)
}

function nuPreviewIcon (i, s) {
  s = nuEscapeHTML(s)

  const $i = $('#' + i)

  $i.html('')

  if (s.startsWith('fas ') || s.startsWith('fa ') || s.startsWith('far ') || s.startsWith('fa-')) {
    $i.append('<i class="' + s + ' fa-2x' + '"></i>')
  } else if (s.startsWith('<i class="fa')) {
    const i = s.indexOf('>', 10)
    $i.append(s.nuInsertString(i - 1, ' fa-2x'))
  } else {
    $i.append(s)
  }
}

function addFileUploadScript () {
  const htmlCode = $('#sob_html_code')

  if (!htmlCode.val().includes('new Uppy.Core') && nuGetValue('sob_input_file_target') == '0') {
    const uppyScript = `
<div id="#uppy_div#"></div>

<script>
    
    nuInitUppy();
    
    function nuInitUppy() {

        const $objId= $('#' + '#this_object_id#');
        const target = '#' + '#uppy_div#';
    
        let uppy = new Uppy.Core();
    
        uppy.use(Uppy.Dashboard, {
                inline: true
                , bundle: true
                , height: $objId.cssNumber('height')
                , width: $objId.cssNumber('width')
                , target: target
                , showProgressDetails: true
                , replaceTargetContent: true
                , method: 'post'
            })
            .use(Uppy.XHRUpload, {
                endpoint: 'core/nuapi.php'
            })
    
    	uppy.on('upload', (file) => {
    		uppy.setMeta({
    			procedure: 'NUUPLOADFILE_TEMPLATE',
    			session_id: window.nuSESSION
    		})
    	});

        uppy.on('complete', (result) => {
    
            if (window.nuOnFileUploadComplete) {
                nuOnFileUploadComplete('FS', $objId.attr('id'), result);
            }
    
        })

    }

</script>
`

    nuSetValue('sob_html_code', htmlCode.val() + uppyScript)

    if (sob_all_height.value < 30) nuSetValue('sob_all_height', '250')
  }
}

// Pick Tabs

function openMenu (event, menu, element) {
  event.stopPropagation()
  ctxmenu.show(menu, element)
}

function setTabId (tabTitle) {
  const tab = parent.$('.nuTab').filter(function () {
    return $(this).html() == tabTitle
  })

  if (tab.length == 1) {
    nuGetLookupId(tab.attr('data-nu-tab-id'), 'sob_all_zzzzsys_tab_id', true, true)
  }
}

function menuPickTabsClick (element, event) {
  if (!nuIsIframe()) {
    return
  }

  const items = []

  const item = {
    text: nuTranslate('Tabs')
  }

  items.push(item)

  window.parentTabs.each(function () {
    const item =
            {
              text: nuContextMenuItemText(this.innerHTML, 'fa-regular fa-square'),
              action: () => setTabId(this.innerHTML)
            }

    items.push(item)
  })

  openMenu(event, items, element)
}

$('#sob_all_zzzzsys_tab_idbutton').on('contextmenu', function (e) {
  e.preventDefault()
  menuPickTabsClick(this, event)
})
