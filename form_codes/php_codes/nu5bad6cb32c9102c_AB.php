$s  = "
        SELECT * 
        FROM zzzzsys_form
        WHERE zzzzsys_form_id = '#LOOKUP_RECORD_ID#'
        
        ";

$t  = nuRunQuery($s);
$c = db_num_rows($t);
if ($c == 1) {$r  = db_fetch_object($t); }


nuSetFormValue('sob_subform_table', $c == 1 ? $r->sfo_table: '');