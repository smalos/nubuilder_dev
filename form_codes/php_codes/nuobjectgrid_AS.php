$s  = "
    SELECT * 
    FROM zzzzsys_browse 
    WHERE sbr_zzzzsys_form_id = '#RECORD_ID#'
    ORDER BY sbr_order;
";


$t = nuRunQuery($s);
$o = 10;

while($r = db_fetch_object($t)){
        
    $s  = "
        UPDATE zzzzsys_browse 
        SET sbr_order = '$o'
        WHERE zzzzsys_browse_id = '$r->zzzzsys_browse_id'
        ORDER BY sbr_order;
    ";
    
    nuRunQuery($s);
    
    $o = $o + 10;    
    
}

$s  = "
    SELECT * 
    FROM zzzzsys_tab 
    WHERE syt_zzzzsys_form_id = '#RECORD_ID#'
    ORDER BY syt_order;
";

$t = nuRunQuery($s);
$o = 10;

while($r = db_fetch_object($t)){
        
    $s  = "
        UPDATE zzzzsys_tab 
        SET syt_order = '$o'
        WHERE zzzzsys_tab_id = '$r->zzzzsys_tab_id'
        ORDER BY syt_order;
    ";
    
    nuRunQuery($s);
    
    $o = $o + 10;    
    
}
