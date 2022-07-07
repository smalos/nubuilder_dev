$s  = "
        SELECT * 
        FROM zzzzsys_tab 
        JOIN zzzzsys_form ON zzzzsys_form_id = syt_zzzzsys_form_id
        WHERE zzzzsys_tab_id = '#LOOKUP_RECORD_ID#'
        
        ";

$t  = nuRunQuery($s);
$c = db_num_rows($t);
if ($c == 1) {$r  = db_fetch_object($t); }

nuSetFormValue('sob_all_zzzzsys_form_id', $c == 1 ? $r->syt_zzzzsys_form_id: '');
nuSetFormValue('sob_all_table', $c == 1 ? $r->sfo_table: '');