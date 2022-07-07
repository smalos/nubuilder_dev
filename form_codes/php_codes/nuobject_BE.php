
$s = "



SELECT 
	sob_all_zzzzsys_form_id AS theform,
	sob_all_id AS ids,
	sob_all_type AS type
FROM zzzzsys_object 
WHERE 
sob_all_zzzzsys_form_id = '#sob_all_zzzzsys_form_id#' AND 
	((sob_input_type = 'nuNumber' AND sob_all_type = 'input')
	OR (sob_input_type = 'number' AND sob_all_type = 'input')
	OR sob_all_type = 'calc' OR sob_all_type = 'select')

UNION 

SELECT 
   su.sob_all_zzzzsys_form_id AS theform,
   CONCAT(su.sob_all_id, '.', inp.sob_all_id) AS ids,
   inp.sob_all_type AS type
FROM zzzzsys_object AS su
JOIN zzzzsys_object AS inp ON su.sob_subform_zzzzsys_form_id = inp.sob_all_zzzzsys_form_id
WHERE 
su.sob_all_type = 'subform' AND 
su.sob_all_zzzzsys_form_id = '#sob_all_zzzzsys_form_id#' AND 
	((inp.sob_input_type = 'nuNumber' AND inp.sob_all_type = 'input')
	OR (inp.sob_input_type = 'number' AND inp.sob_all_type = 'input')
	OR inp.sob_all_type = 'calc' OR inp.sob_all_type = 'select')

";


$t  = nuRunQuery($s);
$a  = array();

while($r = db_fetch_object($t)){
    $a[]  = $r;    
}

$j  = json_encode($a);
$js = "

function nuCalcObjects(){
    return $j;
}

";

nuAddJavascript($js);