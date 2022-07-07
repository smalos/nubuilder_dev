$r = '#RECORD_ID#';
$f = '#sob_all_zzzzsys_form_id#';
$o = '#sob_all_id#';

$s = "
    
        SELECT COUNT(*) 
        FROM zzzzsys_object
        WHERE sob_all_zzzzsys_form_id = '$f'
        AND sob_all_id = '$o'
        AND zzzzsys_object_id != '$r'

    ";

$t = nuRunQuery($s);
$r = db_fetch_row($t);

if ($r[0] > 0) {
    nuDisplayError(nuTranslate('This <b>ID</b> is already used on this Form..'));
}

if ('#sob_all_label#' == '') {
    nuDisplayErrorNotBlank('Label');
}

$o = '#sob_all_type#';

if ($o == 'display') {
    if ('#sob_display_sql#' == '') {
        nuDisplayErrorNotBlank('Display');
    }
}

if ($o == 'html') {

    if ('#sob_html_code#' == '' && '#sob_html_chart_type#' == '') {
        nuDisplayError(nuTranslate('HTML Fields Cannot Both Be Blank..'));
    }
    if ('#sob_html_javascript#' == '' && '#sob_html_chart_type#' != '') {
        nuDisplayErrorNotBlank('HTML Javascript Array');
    }

}

if ($o == 'lookup') {
    if ('#sob_lookup_zzzzsys_form_id#' == '') {
        nuDisplayErrorNotBlank('Form');
    }
    if ('#sob_lookup_code#' == '') {
        nuDisplayErrorNotBlank('Code');
    }
    if ('#sob_lookup_description#' == '') {
        nuDisplayErrorNotBlank('Descrition');
    }
    if ('#sob_lookup_description_width#' == '') {
        nuDisplayErrorNotBlank('Width');
    }
}

if ($o == 'run') {
    if ('#sob_run_zzzzsys_form_id#' == '') {
        nuDisplayErrorNotBlank('Run');
    }
    if ('#sob_run_method#' == '') {
        nuDisplayErrorNotBlank('Method');
    }
}

if ($o == 'input') {

    if ('#sob_input_type#' == '') {
        nuDisplayErrorNotBlank("Input's Input Type");
    }

    if ('#sob_input_type#' == 'nuNumber' || '#sob_input_type#' == 'nuDate') {
        if ('#sob_input_format#' == '') {
            nuDisplayErrorNotBlank('Input Format');
        }
    }

    if ('#sob_input_type#' == 'nuAutoNumber') {
        if ('#sob_input_count#' == '') {
            nuDisplayErrorNotBlank('Next Number');
        }
    }

}

if ($o == 'select') {
    if ('#sob_select_multiple#' == '') {
        nuDisplayErrorNotBlank('Multiple');
    }
    if ('#sob_select_sql#' == '') {
        nuDisplayErrorNotBlank('SQL/List');
    }
}

if ($o == 'subform') {
    if ('#sob_subform_zzzzsys_form_id#' == '') {
        nuDisplayErrorNotBlank('Form');
    }
    if ('#sob_subform_foreign_key#' == '') {
        nuDisplayErrorNotBlank('Foreign Key');
    }
    if ('#sob_subform_add#' == '') {
        nuDisplayErrorNotBlank('Addable');
    }
    if ('#sob_subform_delete#' == '') {
        nuDisplayErrorNotBlank('Deletable');
    }
    if ('#sob_subform_type#' == '') {
        nuDisplayErrorNotBlank('Type');
    }
}

if ($o == '') {
    if ('#sfo_browse_sql#' == '') {
        nuDisplayErrorNotBlank('Browse SQL');
    }
}

function nuDisplayErrorNotBlank($label) {

    $label = '<b>' . $label . '</b>';
    nuDisplayError($label . ' ' . nuTranslate('cannot be left blank'));

}

