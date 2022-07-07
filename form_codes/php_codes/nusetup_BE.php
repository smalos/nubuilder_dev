// Settings

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


//File Version


function getFileVersion() {
    $f = __DIR__ . '/../version.txt';
    if (is_readable($f)) {
        $lines = file($f) [3];
        $lines = preg_replace("/\r|\n/", "", $lines);
        $v = substr($lines, 15, strlen($lines) - 15);
        return $v;

    }
    return "Unknown";
}

$v = getFileVersion();

$j = "

    function nuGetFilesVersion() {
        return '$v';
    }

";

nuAddJavascript($j);