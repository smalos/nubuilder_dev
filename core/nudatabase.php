<?php

mb_internal_encoding('UTF-8');

$_POST['RunQuery']		= 0;

if (isset($_SESSION['nubuilder_session_data'])) {
	$sessionData		= $_SESSION['nubuilder_session_data'];
}

$DBHost					= isset($sessionData['DB_HOST'])		? $sessionData['DB_HOST']		: $nuConfigDBHost;
$DBName					= isset($sessionData['DB_NAME'])		? $sessionData['DB_NAME']		: $nuConfigDBName;
$DBUser					= isset($sessionData['DB_USER'])		? $sessionData['DB_USER']		: $nuConfigDBUser;
$DBPassword				= isset($sessionData['DB_PASSWORD'])	? $sessionData['DB_PASSWORD']	: $nuConfigDBPassword;
$DBCharset				= isset($sessionData['DB_CHARSET'])		? $sessionData['DB_CHARSET']	: 'utf8';
$DBOptions				= isset($sessionData['DB_OPTIONS'])		? $sessionData['DB_OPTIONS']	: (isset($nuConfigDBOptions) ? $nuConfigDBOptions : null);

$charSet				= array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES $DBCharset");

if (is_array($DBOptions)) {
	array_merge($charSet, $DBOptions);
} else {
	$DBOptions = $charSet;
}

try {
	$nuDB 				= new PDO("mysql:host=$DBHost;dbname=$DBName;charset=$DBCharset", $DBUser, $DBPassword, $DBOptions);
	$nuDB->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
	echo 'Connection to the nuBuilder database failed: ' . $e->getMessage();
	echo '<br><br>Verify and update the settings in nuconfig.php';
	echo '<br><br>Restart your browser after modifying nuconfig.php in order for changes to be reflected';
	die();
}

$GLOBALS['sys_table_prefix'] = array(
	'access' => 'sal',
	'access_form' => 'slf',
	'access_php' => 'slp',
	'access_report' => 'srp',
	'browse' => 'sbr',
	'cloner' => 'clo',
	'code_snippet' => 'cot',
	'config' => 'cfg',
	'debug' => 'deb',
	'event' => 'sev',
	'file' => 'sfi',
	'form' => 'sfo',
	'format' => 'srm',
	'info' => 'inf',
	'note' => 'not',
	'note_category' => 'hoc',
	'object' => 'sob',
	'php' => 'sph',
	'report' => 'sre',
	'select' => 'sse',
	'select_clause' => 'ssc',
	'session' => 'sss',
	'setup' => 'set',
	'sso_login' => 'sso',
	'tab' => 'syt',
	'timezone' => 'stz',
	'translate' => 'trl',
	'user' => 'sus'
);

function nuRunQueryNoDebug($s, $a = array(), $isInsert = false){

	global $nuDB;

	$object = $nuDB->prepare($s);

	try {
		$object->execute($a);
	}catch(PDOException $ex){
	}

	if($isInsert){
		return $nuDB->lastInsertId();
	}else{
		return $object;
	}

}

function nuRunQueryTest($s, $a = array()){

	global $nuDB;

	$object = $nuDB->prepare($s);

	try {
		$object->execute($a);
	}catch(PDOException $ex){
		return $ex->getMessage();
	}

	return true;

}

function nuDebugMessageString($user, $message, $sql, $trace) {

		$debug	= "
		===USER==========

		$user

		===PDO MESSAGE===

		$message

		===SQL===========

		$sql

		===BACK TRACE====

		$trace

		";

		return  trim(preg_replace('/\t/', '', $debug));

}

function nuRunQuery($sql, $a = array(), $isInsert = false){

	global $DBHost;
	global $DBName;
	global $DBUser;
	global $DBPassword;
	global $nuDB;
	global $DBCharset;

	if($sql == ''){
		$a			= array();
		$a[0]		= $DBHost;
		$a[1]		= $DBName;
		$a[2]		= $DBUser;
		$a[3]		= $DBPassword;
		$a[4]		= $nuDB;
		$a[4]		= $DBCharset;
		return $a;
	}

	// nuLog($s, count($a)> 0 ? $a[0] : '');
	$stmt = $nuDB->prepare($sql);

	try {
		$stmt->execute($a);
	}catch(PDOException $ex){

		$user		= 'globeadmin';
		$message	= $ex->getMessage();
		$array		= debug_backtrace();
		$trace		= '';

		$count = count($array);
		for($i = 0 ; $i < $count; $i ++){
			$trace .= $array[$i]['file'] . ' - line ' . $array[$i]['line'] . ' (' . $array[$i]['function'] . ")\n\n";
		}

		$debug = nuDebugMessageString($user, $message, $sql, $trace);

		$_POST['RunQuery']		= 1;
		nuDebug($debug);
		$_POST['RunQuery']		= 0;

		$id						= $nuDB->lastInsertId();
		$GLOBALS['ERRORS'][]	= $debug;

		return -1;

	}

	if($isInsert){

		return $nuDB->lastInsertId();

	}else{

		return $stmt;

	}

}


function db_is_auto_id($table, $pk){

	$s		= "SHOW COLUMNS FROM `$table` WHERE `Field` = '$pk'";
	$t		= nuRunQuery($s);									//-- mysql's way of checking if its an auto-incrementing id primary key

	if (db_num_rows($t) == 0) {
		nuDisplayError(nuTranslate("The Primary Key is invalid"). ": ". $pk);
		return false;
	}

	$r		= db_fetch_object($t);
	return $r->Extra == 'auto_increment';

}

function db_fetch_array($o){

	if (is_object($o)) {
		return $o->fetch(PDO::FETCH_ASSOC);
	} else {
		return array();
	}

}

function db_fetch_all_array($o){

	if (is_object($o)) {
		return $o->fetchAll(PDO::FETCH_ASSOC);
	} else {
		return array();
	}

}

function db_fetch_key_pair_array($o){

	if (is_object($o)) {
		return $o->fetchAll(PDO::FETCH_KEY_PAIR);
	} else {
		return array();
	}

}

function db_fetch_object($o){

	if (is_object($o)) {
		return $o->fetch(PDO::FETCH_OBJ);
	} else {
		return false;
	}

}

function db_fetch_all_column($o){

	if (is_object($o)) {
		return $o->fetchAll(PDO::FETCH_COLUMN);
	} else {
		return array();
	}

}

function db_fetch_all_object($o){

	if (is_object($o)) {
		return $o->fetchAll(PDO::FETCH_OBJ);
	} else {
		return false;
	}

}

function db_fetch_row($o){

	if (is_object($o)) {
		return $o->fetch(PDO::FETCH_NUM);
	} else {
		return false;
	}

}

function db_fetch_all_row($o){

	if (is_object($o)) {
		return $o->fetchAll(PDO::FETCH_NUM);
	} else {
		return false;
	}

}

function db_update_value($table, $pk, $recordId, $column, $newValue) {

	$update = "UPDATE `$table` SET `$column` = ? WHERE `$pk` = ?";
	nuRunQuery($update, array($newValue, $recordId));

}

function db_fetch_value($table, $pk, $recordId, $column) {

	$select = "SELECT `$column` FROM `$table` WHERE `$pk` = ?";
	$result = nuRunQuery($select, array($recordId));
	if (db_num_rows($result) == 1) {
		$arr = db_fetch_array($result);
		return $arr[$column];
	} else {
		return false;
	}

}

function db_field_info($n){

	$fields		= array();
	$types		= array();
	$pk			= array();

	$s			= "DESCRIBE `$n`";
	$t			= nuRunQueryNoDebug($s);

	while($r = db_fetch_row($t)){

		$fields[] = $r[0];
		$types[] = $r[1];

		if($r[3] == 'PRI'){
			$pk[] = $r[0];
		}

	}

	return array($fields, $types, $pk);

}

function db_field_names($n){

	$a	= array();
	$s	= "DESCRIBE `$n`";
	$t	= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[] = $r[0];
	}

	return $a;

}


function db_field_types($n){

	$a		= array();
	$s		= "DESCRIBE `$n`";
	$t		= nuRunQuery($s);

	while($r = db_fetch_row($t)){
		$a[] = $r[1];
	}

	return $a;

}

function db_field_exists($tableName, $fieldName) {

	$fields = db_field_names($tableName);
	return array_search($fieldName, $fields) != false;

}

function db_primary_key($n){

	$a		= array();
	$s		= "DESCRIBE `$n`";
	$t		= nuRunQuery($s);

	while($r = db_fetch_row($t)){

		if($r[3] == 'PRI'){
			$a[] = $r[0];
		}

	}

	return $a;

}

function nuDBQuote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}

function db_num_rows($o) {

	if(!is_object($o)){return 0;}
	return $o->rowCount();

}

function db_num_columns($o) {

	if(!is_object($o)){return 0;}
	return $o->columnCount();

}

function db_quote($s) {

	global $nuDB;
	return $nuDB->quote($s);

}


function nuViewExists($view) {

	$sql = "SELECT table_name as TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_TYPE = 'VIEW' AND table_schema = DATABASE() AND TABLE_NAME = ?";
	$qry = nuRunQuery($sql, array($view));

	return db_num_rows($qry);

}

function nuCanCreateView() {

	$qry = nuRunQuery("SHOW GRANTS FOR CURRENT_USER()");
	$canCreateView = false;

	while ($row = db_fetch_row($qry)) {
		if (strpos($row[0], 'CREATE VIEW') !== false) {
			$canCreateView = true;
			break;
		}
	}

	return $canCreateView;

}


function nuDebugResult($msg){

	if(is_object($msg)){
		$msg = print_r($msg,1);
	}

	$userId = null;
	if (function_exists('nuHash')) {
		$h = nuHash();
		$userId = isset($h) && isset($h['USER_ID']) ? $h['USER_ID'] : null;
		$userId = $userId == null && isset($_POST['nuSTATE']['username']) ? $_POST['nuSTATE']['username'] : $userId;
	}

	$id = nuID();

	$s = "INSERT INTO zzzzsys_debug (zzzzsys_debug_id, deb_message, deb_added, deb_user_id) VALUES (:id , :message, :added, :user_id)";

	$params = array(
		"id"		=> $id,
		"message"	=> $msg,
		"added"		=> time(),
		"user_id"	=> $userId
	);

	nuRunQuery($s, $params);

	return $id;

}

function nuDebug($a){

	$date				= date("Y-m-d H:i:s");
	$b					= debug_backtrace();
	$f					= $b[0]['file'];
	$l					= $b[0]['line'];
	$m					= "$date - $f line $l\n\n<br>\n";

	$nuSystemEval				= '';
	if ( isset($_POST['nuSystemEval']) ) {
		$nuSystemEval			= $_POST['nuSystemEval'];
	}
	$nuProcedureEval			= '';
	if ( isset($_POST['nuProcedureEval']) ) {
		$nuProcedureEval		= $_POST['nuProcedureEval'];
	}

	if($_POST['RunQuery'] == 1){
		$m				= "$date - SQL Error in <b>nuRunQuery</b>\n\n<br>\n" ;
	}else{
		$m				= "$date - $nuProcedureEval $nuSystemEval line $l\n\n<br>\n" ;
	}

	for($i = 0 ; $i < func_num_args() ; $i++){

		$p				= func_get_arg($i);

		$m				.= "\n[$i] : ";

		if(gettype($p) == 'object' or gettype($p) == 'array'){
			$m			.= print_r($p,1);
		}else{
			$m			.= $p;
		}

		$m				.= "\n";

	}

	nuDebugResult($m);

}

function nuLog($s1, $s2 = '', $s3 = '') {

	$dataToLog = array(date("Y-m-d H:i:s"), $s1, $s2, $s3);

	$data = implode(" - ", $dataToLog);
	// $data = print_r($dataToLog, true);

	$dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR. 'temp' . DIRECTORY_SEPARATOR;
	file_put_contents($dir . 'nulog.txt', $data.PHP_EOL , FILE_APPEND | LOCK_EX);

}

function nuID(){

	global $DBUser;
	$i	= uniqid();
	$s	= md5($i);

	while($i == uniqid()){}

	$prefix = $DBUser == 'nudev' ? 'nu' : '';
	return $prefix.uniqid().$s[0].$s[1];

}

?>
