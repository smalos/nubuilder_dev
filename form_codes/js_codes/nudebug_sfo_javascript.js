$('#deb_message')
  .css('font-size', 10)
  .css('background-color', '#FFEEA6')
  .prop('readonly', true)
  .dblclick(function () {
    	nuOpenAce('Text', this.id)
  })

$('#delete_option').val(0)
$('#nuAddButton').remove()
$('#nuOptions').remove()

const mess = String($('#deb_message').val())
const i = mess.indexOf('<br>')
const m = mess.substr(i + 6)
const t = mess.substr(0, i)

nuSetTitle(mess.substr(0, i))

$('#nuTab0').remove()

$('#nuBreadcrumb2')
  .css('text-align', 'center')
  .css('width', '95%')
  .css('color', 'black')
  .css('padding', '5px')
  .html(t + ' :: ' + nuWhen($('#deb_added').val()))
  .appendTo('#nuTabHolder')

$('#deb_message').val(m)

$("[data-nu-column='1']").each(function (index) {
  if ($(this).html().trim() !== '') {
    const nuhtm = nuWhen(Number($(this).html()))

    $(this).html(nuhtm)
  }
})

if (nuFORM.getCurrent().record_id !== '') {
  $('.nuActionButton').remove()
  nuAddActionButton('Delete')
  nuAddActionButton('DeleteAll', 'Delete All', 'nuDeleteAllAction()')
} else {
  nuAddActionButton('DeleteAll', 'Delete All', 'nuDeleteAllAction()')
}
