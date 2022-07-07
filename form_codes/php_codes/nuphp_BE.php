$rid    = '#RECORD_ID#';

if($rid != '-1' and $rid != '-2'){ 
    
    $s      = "SELECT * FROM zzzzsys_php WHERE zzzzsys_php_id = '$rid'";
    $t      = nuRunQuery($s);
    $r      = db_fetch_object($t);
    
    if(db_num_rows($t) == 0){
    
        $s              = "
        INSERT INTO zzzzsys_php
        (
            zzzzsys_php_id,
            sph_code,
            sph_description,
            sph_group,
            sph_system
        )
        VALUES
        (
            '$rid', 
            '$rid', 
            'System PHP', 
            'nubuilder', 
            '1'
        )
        ";
        
        nuRunQuery($s);
        
    }
    
}

