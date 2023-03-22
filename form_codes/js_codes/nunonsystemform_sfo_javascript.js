$("[data-nu-column='0']").each(function () {
  $(this).addClass('nu_' + this.textContent)
})

$('#nuAddButton').remove()
$('#nuPrintButton').remove()
