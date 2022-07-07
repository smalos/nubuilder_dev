$('#nuAddButton').remove()
$('#nuPrintButton').remove()

function nuSelectBrowse (e) {
  const r = $('#' + e.target.id).attr('data-nu-row')
  const p = $('#nucell_' + r + '_0').html()
  const f = $('#' + e.target.id).attr('data-nu-primary-key')

  nuGetPHP(p, f)
}
