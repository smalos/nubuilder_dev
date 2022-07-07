$('#nuAddButton').remove();
$('#nuPrintButton').remove();

function nuSelectBrowse(e) {

    var r = $('#' + e.target.id).attr('data-nu-row');
    var p = $('#nucell_' + r + '_0').html();
    var f = $('#' + e.target.id).attr('data-nu-primary-key');

    nuGetPHP(p, f);

}