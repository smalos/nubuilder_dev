
$t          = nuRunQuery("SELECT MAX(trl_language) FROM zzzzsys_translate GROUP BY trl_language");
$a          = array();

while($r = db_fetch_row($t)){
    $a[]    = $r[0];    
}

$j          = json_encode($a);
$f          = "

function nuLanguages(){
    
    return $j;
    
}

";

nuAddJavascript($f);