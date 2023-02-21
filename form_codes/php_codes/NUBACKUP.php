if (nuDemo()) return;

// *******************************************************************

// Settings. Please modify if different.

//Use nuBuilder DB settings. Path to nuconfig.php
$path_nuconfig_php = __DIR__ . '/../nuconfig.php';

// Path to Mysqldump.php
$path_mysqldump_php = __DIR__ . '/libs/mysqldump/Mysqldump.php';

// Directory to write the sql dump to
$path_sql_dump = __DIR__ . '/libs/mysqldump/dumps/';

//global $nuConfigBackupLocation;
// $path_sql_dump = (! isset($nuConfigBackupLocation) || $nuConfigBackupLocation = '') ?  __DIR__ . '/libs/mysqldump/dumps/' : nuStringAddTrailingCharacter($nuConfigBackupLocation);

// Save dump to file:
$file_name = date('m-d-Y_H:i:s') . '_' . 'nuBuilder_backup' . '.sql.gzip';

// *******************************************************************

try {
    require_once ($path_mysqldump_php);
} catch (Exception $e) {
    nuDisplayError('require_once failed! Error: '.$e);
}

try {
    require $path_nuconfig_php;
} catch (Exception $e) {
    nuDisplayError('require failed! Error: '.$e);
}

// Dump Settings
$dumpSettings = [];
$dumpSettings['single-transaction'] = false;
$dumpSettings['no-create-info'] = false;
$dumpSettings['lock-tables'] = false;
$dumpSettings['add-locks'] = false;
$dumpSettings['extended-insert'] = false;
$dumpSettings['skip-definer'] = true;
$dumpSettings['routines'] = true;
$dumpSettings['compress'] = Ifsnop\Mysqldump\Mysqldump::GZIP;

/*
// DEV
    includeTables($dumpSettings);
    excludeTables($dumpSettings);
*/

// Create Mysqldump
$dumper = new Ifsnop\Mysqldump\Mysqldump("mysql:host=$nuConfigDBHost;dbname=$nuConfigDBName", $nuConfigDBUser, $nuConfigDBPassword, $dumpSettings);

$tableWheres = [
    "zzzzsys_session" => "zzzzsys_session_id not like 's%' "
];


if ("#nubackup_user_records_only#" == "1") {

    $tableWheresNotNu = [
        "zzzzsys_access" => "zzzzsys_access_id not like 'nu%' ",
        "zzzzsys_access_form" => "zzzzsys_access_form_id not like 'nu%' ",
        "zzzzsys_access_php" => "zzzzsys_access_php_id not like 'nu%' ",
        "zzzzsys_access_report" => "zzzzsys_access_report_id not like 'nu%' ",
        "zzzzsys_browse" => "zzzzsys_browse_id not like 'nu%' ",
        "zzzzsys_cloner" => "zzzzsys_cloner_id not like 'nu%' ",
        "zzzzsys_code_snippet" => "zzzzsys_code_snippet_id not like 'nu%' ",
        "zzzzsys_debug" => "zzzzsys_debug_id not like 'nu%' ",
        "zzzzsys_event" => "zzzzsys_event_id not like 'nu%' ",
        "zzzzsys_file" => "zzzzsys_file_id not like 'nu%' ",
        "zzzzsys_form" => "zzzzsys_form_id not like 'nu%' ",
        "zzzzsys_format" => "zzzzsys_format_id not like 'nu%' ",
        "zzzzsys_info" => "zzzzsys_info_id not like 'nu%' ",
        "zzzzsys_note" => "zzzzsys_note_id not like 'nu%' ",
        "zzzzsys_note_category" => "zzzzsys_note_category_id not like 'nu%' ",
        "zzzzsys_object" => "zzzzsys_object_id not like 'nu%' ",
        "zzzzsys_object_list" => "zzzzsys_object_list_id not like 'nu%' ",
        "zzzzsys_php" => "zzzzsys_php_id not like 'nu%' ",
        "zzzzsys_report" => "zzzzsys_report_id not like 'nu%' ",
        "zzzzsys_report_data" => "zzzzsys_report_data_id not like 'nu%' ",
        "zzzzsys_run_list" => "zzzzsys_run_list_id not like 'nu%' ",
        "zzzzsys_select" => "zzzzsys_select_id not like 'nu%' ",
        "zzzzsys_select_clause" => "zzzzsys_select_clause_id not like 'nu%' ",
        "zzzzsys_setup" => "zzzzsys_setup_id not like 'nu%' ",
        "zzzzsys_tab" => "zzzzsys_tab_id not like 'nu%' ",
        "zzzzsys_timezone" => "zzzzsys_timezone_id not like 'nu%' ",
        "zzzzsys_translate" => "zzzzsys_translate_id not like 'nu%' ",
        "zzzzsys_user" => "zzzzsys_user_id not like 'nu%' "
    ];

    $tableWheres = array_merge($tableWheresNotNu, $tableWheres);

}


$downloadFile = true;
$dumper->setTableWheres($tableWheres);


$dump_file = $path_sql_dump . nuSanitizeFilename($file_name);

// Start the dump
try {

    if (!is_dir($path_sql_dump)) {
        mkdir($path_sql_dump, 0755);
    }

    $dumper->start($dump_file);
    
    /*
        // DEV
        if ($downloadFile) {
            header('Content-Type: text/plain;charset=utf-8');
            header("Pragma: no-cache");
            header("Expires: 0");
            header('Content-Disposition: attachment; filename="dump.sql"');
            $dumper->start('php://output');
        } else {
            $dumper->start($dump_file);
        }
    */
}
catch(\Exception $e) {
    nuDisplayError('Export Error: ' . $e->getMessage());
}

$dump_file = base64_encode($path_sql_dump . $file_name);

$js = "
   nuMessage(['<h2>Export completed!</h2><br>SQL Dump saved in ' + atob('$dump_file')]);
";

nuJavaScriptCallback($js);


function includeTables(array & $dumpSettings) {

    $tables = nuGetProperty('nubackup_tables_include');
    if ($tables) {
        $dumpSettings["include-tables"] = json_decode(stripslashes($tables));
    }

}

function excludeTables(array & $dumpSettings) {

    $tables = nuGetProperty('nubackup_tables_exclude');
    if ($tables) {
        $dumpSettings["exclude-tables"] = json_decode(stripslashes($tables));
    }

}