function nuConfigValueToTable($line, $setting, $oldValue) {

    $parts = explode("=", $line);

    $newValue = $parts[1];
    $newValue = str_replace('"', "", $newValue);
    $newValue = str_replace("'", "", $newValue);

    $partsValue = explode(";", $newValue);
    $newValue = trim($partsValue[0]);

    $update = $newValue != $oldValue;

    if ($setting == 'nuCalendarStartOfWeek' && strlen($newValue) > 1) {
        $newValue = str_replace("Monday", "1", $newValue);
        $newValue = str_replace("Sunday", "0", $newValue);
    }

    if ($update) nuRunQuery('UPDATE zzzzsys_config SET cfg_value = ? WHERE cfg_setting = ?', [$newValue, $setting]);

    return $update;

}

if ("#configImport#" == '1') {

    // Import config settings form nuconfig.php
    $s = "SELECT cfg_setting, cfg_value AS old_value FROM zzzzsys_config ";
    $t = nuRunQuery($s);
    $config = file(__DIR__ ."/../nuconfig.php");

    while ($r = db_fetch_object($t)) {

        foreach ($config as $line) {
            if (trim($line) !== '' && nuStringContains($r->cfg_setting, $line) == true) {
                nuConfigValueToTable($line, $r->cfg_setting, $r->old_value);
                break;
            }

        }

    }

}