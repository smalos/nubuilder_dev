nuSetTitle(nuFORM.getCurrent().run_description);

$('#nuAddButton').remove();
$('#nuPrintButton').remove();

function nuSelectBrowse(e) {

    const cell = $(e.target).closest('div');
    const row = cell.attr('data-nu-row');
    const form = $('#nucell_' + row + '_0').html() || 'nublank';
    const primaryKey = cell.attr('data-nu-primary-key');

    nuGetReport(form, primaryKey);

}