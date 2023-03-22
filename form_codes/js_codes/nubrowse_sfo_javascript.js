$('#nuSearchButton').remove()
$('#nuSearchField').remove()
$('#nuPrintButton').remove()

nuSetTitle($('#sbr_title').val())

const pid = parent.nuFORM.getCurrent().record_id

if (nuFORM.getCurrent().record_id == -1) {
  $('#sbr_zzzzsys_form_id').val(pid).change()
}
