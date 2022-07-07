
$s  = "
        SELECT * 
        FROM zzzzsys_form
        WHERE zzzzsys_form_id = '#LOOKUP_RECORD_ID#'
        
        ";

$t  = nuRunQuery($s);

if (db_num_rows($t) == 1) {
    $r  = db_fetch_object($t);
    nuSetFormValue('sob_lookup_table', $r->sfo_table);
}    
    
