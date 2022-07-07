$rid    = '#RECORD_ID#';

if($rid != '-1' and $rid != '-2'){ 
    
    $s      = "SELECT * FROM zzzzsys_select WHERE zzzzsys_select_id = '$rid'";
    $t      = nuRunQuery($s);
    $r      = db_fetch_object($t);
    
    if(db_num_rows($t) == 0){
        
        $s              = "
        INSERT INTO zzzzsys_select
        (zzzzsys_select_id, sse_system)
        VALUES
        ('$rid', '1')
        ";
        
        nuRunQuery($s);
        
    }
    
}

