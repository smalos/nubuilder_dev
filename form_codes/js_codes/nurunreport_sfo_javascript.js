nuSetTitle(nuFORM.getCurrent().run_description);

$('#nuAddButton').remove();
$('#nuPrintButton').remove();

function nuSelectBrowse(e) {

    var r = $('#' + e.target.id).attr('data-nu-row');
    var f = $('#nucell_' + r + '_0').html();
    var p = $('#' + e.target.id).attr('data-nu-primary-key');

    nuGetReport(f, p);

}