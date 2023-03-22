$('#sfo_breadcrumb_title').addClass('sql')
$('#sfo_browse_sql').addClass('sql')
$('#sfo_javascript').addClass('js')

nuSetTitle($('#sfo_table').val())

$('.js').dblclick(function () {
  nuOpenAce('Javascript', this.id)
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

if (window.filter == 'justjs') {
  $('#nuDeleteButton').remove()
  $('#nuCloneButton').remove()
  $('#nuTab0').remove()
  $('#nuTab1').remove()
  $('#nuTab2').click()
  $('#nuTab2').remove()

  nuSetTitle($('#sfo_description').val())
}

function nuFormColor () {
  const t = String($('#sfo_type').val())

  const pb = 'previewbrowse'
  const pe = 'previewedit'

  const bb = 'bb_event'
  const be = 'be_event'
  const bs = 'bs_event'
  const as = 'as_event'
  const bd = 'bd_event'
  const ad = 'ad_event'

  if (t == 'browse') {
    nuDisable([pe, be, bs, as, bd, ad])
  }

  if (t == 'edit') {
    nuDisable([pb, bb])
  }

  if (t == 'launch') {
    nuDisable([pb, bb, as, as, bd, ad])
  }

  if (t == 'subform') {
    nuDisable([pb, bb, be, bs, as, bd, ad, 'sfo_javascript'])
  }

  const h = $('#sfo_type').addClass('nuEdited')

  const o = []
  o.browse		= [0, 1, 2]
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

  for (let i = 0; i < 7; i++) {
    $('#nuTab' + i).removeClass('nuRelatedTab')
  }

  const oType = o[$('#sfo_type').val()]

  if (oType !== undefined) {
    	for (let i = 0; i < t.length; i++) {
    		$('#nuTab' + oType[i]).addClass('nuRelatedTab')
    	}
  }
}

nuFormColor()

$("[data-nu-column='nucolumn000']").each(function () {
  $(this).addClass('nu_' + this.textContent)
})

function nuEventList () {
  if ($('sob_all_type').val() == 'subform') {
    return ['onchange', 'onadd']
  } else {
    return ['onblur', 'onchange', 'onfocus', 'onkeydown']
  }
}
