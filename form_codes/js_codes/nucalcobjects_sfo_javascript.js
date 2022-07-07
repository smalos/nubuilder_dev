
window.nuBrowseFunction = 'nuSelectCalcField'

function nuSelectCalcField (e) {
  const row = e.target.id.substr(0, 8)
  const fld = $('#' + row + '003').html()
  const frm = $('#sob_calc_formula', parent.window.document).val()

  $('#sob_calc_formula', parent.window.document)
    .val(frm + 'nuTotal("' + fld + '")')
    .trigger('change')
}
