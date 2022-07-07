
    $o = '#sfo_type#';

    if('#sfo_type#'             == ''){nuDisplayError('<b>Type</b> Cannot Be Blank..', 'sfo_type');}
    if('#sfo_code#'             == ''){nuDisplayError('<b>Code</b> Cannot Be Blank..', 'sfo_code');}
    if('#sfo_description#'      == ''){nuDisplayError('<b>Description</b> Cannot Be Blank..', 'sfo_description');}


    
    
    if($o == 'browseedit' || $o == 'subform' || $o == 'browse'){
        
        if($o != 'browse'){
            nuCheckTabs();
        }
        
        if($o != 'subform'){
            nuCheckBrowse();
        }
        
        if('#sfo_browse_sql#'   == ''){nuDisplayError('<b>Browse SQL</b> Cannot Be Blank..', 'sfo_browse_sql');}
    }

    if($o == 'edit' or $o == 'launch'){
        nuCheckTabs();
    }

    if($o != 'launch'){
        if('#sfo_table#'            == ''){nuDisplayError('<b>Table Name</b> Cannot Be Blank..', 'sfo_table');}
        if('#sfo_primary_key#'      == ''){nuDisplayError('<b>Primary Key</b> Cannot Be Blank..', 'sfo_primary_key');}
    }

function nuCheckBrowse(){

    $r  = 0;
    $sf = nuSubformObject('zzzzsys_browse_sf');
    
    for($i = 0 ; $i < count($sf->rows) ; $i++){
       if($sf->deleted[$i] == 0){$r++;}
    }
    
    if($r == 0){
       nuDisplayError('<b>Must have at least 1</b> Browse Column Defined..');
    }
    
}

function nuCheckTabs(){

    $r  = 0;
    $sf = nuSubformObject('zzzzsys_tab_sf');
    
    for($i = 0 ; $i < count($sf->rows) ; $i++){
       if($sf->deleted[$i] == 0){$r++;}
    }
    
    if($r == 0){
       nuDisplayError('<b>Must have at least 1</b> Tab Column Defined..');
    }
    
}




