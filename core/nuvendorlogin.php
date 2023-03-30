<?php

require_once('nuchoosesetup.php');
require_once('nuprocesslogins.php');

$sessionId		= $_REQUEST['sessid'];

$appId = isset($_GET['appId']) ? $_GET['appId'] : "";
$table = isset($_GET['table']) ? $_GET['table'] : "";

$values			= [$sessionId];
$sql			= "SELECT * FROM zzzzsys_session WHERE zzzzsys_session_id = ?";
$obj			= nuRunQuery($sql, $values);
$result			= db_num_rows($obj);

if ($_SESSION['nubuilder_session_data']['IS_DEMO']) {
    echo('Not available in the Demo');
    $page   = nuVendorBad($appId);
    return;
}

if ($result == 1) {
    $recordObj		= db_fetch_object($obj);
    $logon_info		= json_decode($recordObj->sss_access);
    $_user			= $logon_info->session->zzzzsys_user_id;
    $_extra_check	= $logon_info->session->global_access;

    if ($_user == $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] && $_extra_check == '1') {
        $page	= nuVendorGood($appId, $table);
    } else {
        $page	= nuVendorBad($appId);
    }
} else {
    $page   = nuVendorBad($appId);
}

header("Location: $page");

function nuVendorGood($appId, $table)
{
    $time = time();

    $page = nuVendorBad($appId);
    if ($appId == 'PMA') {
        $dbName = $_SESSION['nubuilder_session_data']['DB_NAME'];
        $table = $table == "" ? "" : "&table=$table";

        if ($table != '') {
            $page = "libs/nudb/index.php?route=/sql&pos=0&db=$dbName&table=$table&$time=$time";
        } else {
            $page = "libs/nudb/index.php?route=/database/structure&server=1&db=$dbName&$time=$time";
        }
    } elseif ($appId == 'TFM') {
        $page = "libs/tinyfilemanager/tinyfilemanager.php";
    }

    setcookie("nu_".$appId, $_SESSION['nubuilder_session_data']['SESSION_ID']);

    return $page;
}

function nuVendorBad($appId)
{
    $time = time();
    $page = "nuvendorlogout.php?$time=$time";
    setcookie("nu_".$appId, "bad");

    return $page;
}
