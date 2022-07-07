require_once('nusetuplibs.php');

$config = nuConfigScript();
$configCode = $config['code'];
$configJS = $config['js'];

$configJS = $configJS == null ? "" : $configJS. " " . "nuHide('nuconfigsettingsfromdb_hint'); ";


if ($configCode != null) {
    eval($config['code']);
}

nuAddJavascript($configJS);


if (isset($_SESSION['nubuilder_session_data']['USER_ADDITIONAL1_LABEL']) && isset($nuConfigUserAdditional1Label)) {
    $_SESSION['nubuilder_session_data']['USER_ADDITIONAL1_LABEL'] = $nuConfigUserAdditional1Label;
}    

if (isset($_SESSION['nubuilder_session_data']['USER_ADDITIONAL2_LABEL']) && isset($nuConfigUserAdditional2Label)) {
    $_SESSION['nubuilder_session_data']['USER_ADDITIONAL2_LABEL'] = $nuConfigUserAdditional2Label;
}

if (isset($_SESSION['nubuilder_session_data']['USER_CODE_LABEL']) && isset($nuConfigUserCodeLabel)) {
    $_SESSION['nubuilder_session_data']['USER_CODE_LABEL'] = $nuConfigUserCodeLabel;
}

nuAddJavaScript (" 
   nuSERVERRESPONSE.buttons.Clone = '0';
   nuSERVERRESPONSE.buttons.Delete = '0';
", true);