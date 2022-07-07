$i  = 'trl_english';
$t  = nuRunQuery('SELECT COUNT(*) FROM zzzzsys_debug');
$c  = db_fetch_row($t)[0];

$j  = ";$('#$i').val($c);";

nuJavascriptCallback($j);
