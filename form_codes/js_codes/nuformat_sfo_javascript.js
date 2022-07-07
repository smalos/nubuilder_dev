
$('#sign').css('font-style', 'bold').css('font-size', 18)
$('#separator').css('font-style', 'bold').css('font-size', 18)
$('#decimal').css('font-style', 'bold').css('font-size', 18)
$('#places').css('font-style', 'bold').css('font-size', 18)
$('#srm_format').addClass('nuReadonly').css('font-size', 22)

nuSetFormatType()

function nuAddToFormat (e) {
  if ($('#srm_type').val() == 'Date') {
    let v = String(e.target.innerHTML)

    if (v == 'Space') {
      v = ' '
    }

    $('#srm_format').val($('#srm_format').val() + v).change()
  } else {
    const si = $('#sign').val()
    const se = $('#separator').val()
    const pl = $('#places').val()
    const de = Number(pl) > 0 ? $('#decimal').val() : ''
    const cu = JSON.stringify([si, se, de, pl])

    const space = si !== '' ? ' ' : ''
    $('#srm_format').val(si + space + '1' + se + '000' + de + String(0).repeat(pl)).change()

    $('#srm_currency').val(cu).change()
  }
}

function nuSetFormatType (a) {
  nuHide('nucalculator')
  nuHide('sign')
  nuHide('separator')
  nuHide('decimal')
  nuHide('places')

  if (arguments.length == 1) {
    $('#srm_format').val('')
  }

  if ($('#srm_type').val() == 'Date') {
    if (arguments.length == 1) {
      $('#srm_format').val('')
    }

    nuShow('nucalculator')
  }

  if ($('#srm_type').val() == 'Number') {
    if (arguments.length == 1) {
      $('#srm_format').val('1000')
      nuAddToFormat()
    }

    nuShow('sign')
    nuShow('separator')
    nuShow('decimal')
    nuShow('places')
  }
}
