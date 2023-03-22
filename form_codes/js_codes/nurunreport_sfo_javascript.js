nuSetTitle(nuFORM.getCurrent().run_description)

$('#nuAddButton').remove()
$('#nuPrintButton').remove()

function nuSelectBrowse (e) {
  const r = $('#' + e.target.id).attr('data-nu-row')
  const f = $('#nucell_' + r + '_0').html()
  const p = $('#' + e.target.id).attr('data-nu-primary-key')

  nuGetReport(f, p)
}
