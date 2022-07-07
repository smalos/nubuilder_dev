
window.nuBrowseFunction = 'nuSelectCalcField';

function nuSelectCalcField(e){

    var row = e.target.id.substr(0,8);
    var fld = $('#' + row + '003').html();
    var frm = $('#sob_calc_formula', parent.window.document).val();

    $('#sob_calc_formula', parent.window.document)
    .val(frm + 'nuTotal("' + fld + '")')
    .trigger('change');

}

