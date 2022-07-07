$s  = "CREATE TABLE #TABLE_ID# SELECT zzzzsys_object_id AS theid FROM zzzzsys_object WHERE ";
$w  = "1";
if ( $GLOBALS['nuSetup']->set_denied == 1 )  { 
$w  = "sob_all_zzzzsys_form_id NOT LIKE 'nu%' OR sob_all_zzzzsys_form_id = 'nuuserhome'"; 
}
nuRunQuery("$s$w");
