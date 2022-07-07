$is = '#old_password#';
$was = '#new_password_check#';
$will = '#new_password#';
$ses = '#SESSION_ID#';
$userId = "#USER_ID#";

//--

$s = "
 SELECT sss_access 
 FROM zzzzsys_session
 WHERE zzzzsys_session_id = ?
";

$t = nuRunQuery($s, array($ses));
$r = db_fetch_object($t);
$j = json_decode($r->sss_access);

//--

$s = "
 SELECT sus_login_password
 FROM zzzzsys_user
 WHERE zzzzsys_user_id = ?
";

$t = nuRunQuery($s, array($userId));
$r = db_fetch_object($t);
$current = $r->sus_login_password;

$useMd5 = $_SESSION['nubuilder_session_data']['USE_MD5_PASSWORD_HASH'] == true;

if ($useMd5) {
 $check = md5($is) == $current;
} else {
 $check = password_verify($is, $current);
}

if ($check == false) {
 nuDisplayError(nuTranslate('Incorrect Password'));
 return;
} 

//--

$p = nuProcedure('nuCheckPasswordPolicy');

if($p != ''){

 eval($p);
 
 if($check == false){
 return;
 }

}

//--

if($will == $was){

 $s = "

 UPDATE zzzzsys_user 
 SET sus_login_password = ?
 WHERE zzzzsys_user_id = ?
 
 ";

 $pwHash = $useMd5 == true ? md5($will) : nuPasswordHash($will);

 nuRunQuery($s, array($pwHash, $userId));

 nuSetUserJSONData('PASSWORD_CHANGED_TIME', time() , $userId);
 nuSetUserJSONData('PASSWORD_CHANGED_SOURCE', 'user', $userId);
 
 $js = "nuMessage(nuTranslate('Your password has been successfully changed'));";
 
}else {
 $msg = nuTranslate('"New Password" must be the same as "Confirm New Password"');
 $js = "nuMessage($msg);";
}


nuJavascriptCallback($js);

