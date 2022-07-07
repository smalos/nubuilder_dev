
$s = "

CREATE TABLE #TABLE_ID#

SELECT 
   sob_all_zzzzsys_form_id AS theform,
   '' AS theparent,
   sob_all_id AS thechild,
   CONCAT(sob_all_id) as thevalue
FROM zzzzsys_object 
WHERE sob_input_type = 'number'
OR sob_all_type = 'calc'

UNION 

SELECT 
   su.sob_all_zzzzsys_form_id AS theform,
   su.sob_all_id AS theparent,
   inp.sob_all_id AS thechild,
   CONCAT(su.sob_all_id, '.', inp.sob_all_id) as thevalue
FROM zzzzsys_object AS su
JOIN zzzzsys_object AS inp ON su.sob_subform_zzzzsys_form_id = inp.sob_all_zzzzsys_form_id
WHERE su.sob_all_type = 'subform'
AND (
        inp.sob_input_type = 'nuNumber' OR 
        inp.sob_input_type = 'number' OR 
        inp.sob_all_type = 'calc'
    )

";
    
nuRunQuery($s);

