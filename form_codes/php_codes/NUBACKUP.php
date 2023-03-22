if (nuDemo()) return;

// *******************************************************************

// Settings:

// Path where the mysqldump library will save the backup file. Modify this path if needed.
$PATH_MYSQLDUMP = __DIR__ . '/libs/mysqldump/dumps/';

// Filename of the backup file, using the current date and time with a unique identifier and the name of the database.
$FILE_NAME = date('m-d-Y_H:i:s') . '_' . uniqid() . '_' . 'nuBuilder_backup' . '.sql.gzip';

// Settings for the mysqldump library. Modify these if needed.
$dumpSettings = [];
$dumpSettings['single-transaction'] = false;
$dumpSettings['no-create-info'] = false;
$dumpSettings['lock-tables'] = false;
$dumpSettings['add-locks'] = false;
$dumpSettings['extended-insert'] = false;
$dumpSettings['skip-definer'] = true;
$dumpSettings['routines'] = true;
$dumpSettings['compress'] = 'Gzip'; 


// *******************************************************************


// Path to Mysqldump.php
$path_mysqldump_php = __DIR__ . '/libs/mysqldump/Mysqldump.php';

try {
    require_once ($path_mysqldump_php);
} catch (Exception $e) {
    nuDisplayError('require_once failed! Error: '.$e);
}

/*
// DEV
    includeTables($dumpSettings);
    excludeTables($dumpSettings);
*/

// Create Mysqldump
global $nuConfigDBHost, $nuConfigDBName, $nuConfigDBUser, $nuConfigDBPassword;
$dumper = new Ifsnop\Mysqldump\Mysqldump("mysql:host=$nuConfigDBHost;dbname=$nuConfigDBName", $nuConfigDBUser, $nuConfigDBPassword, $dumpSettings);

$tableWheres = [
    "zzzzsys_session" => "zzzzsys_session_id not like 's%' "
];

// Exclude nu records
if ("#nubackup_user_records_only#" == "1") {

    $tableWheresNotNu = [
        "zzzzsys_access" => tableIdNotLikeNu("zzzzsys_access"),
        "zzzzsys_access_form" => tableIdNotLikeNu("zzzzsys_access_form"),
        "zzzzsys_access_php" => tableIdNotLikeNu("zzzzsys_access_php"),
        "zzzzsys_access_report" => tableIdNotLikeNu("zzzzsys_access_report"),
        "zzzzsys_browse" => tableIdNotLikeNu("zzzzsys_browse"),
        "zzzzsys_cloner" => tableIdNotLikeNu("zzzzsys_cloner"),
        "zzzzsys_code_snippet" => tableIdNotLikeNu("zzzzsys_code_snippet"),
        "zzzzsys_debug" => tableIdNotLikeNu("zzzzsys_debug"),
        "zzzzsys_event" => tableIdNotLikeNu("zzzzsys_event"),
        "zzzzsys_file" => tableIdNotLikeNu("zzzzsys_file"),
        "zzzzsys_form" => tableIdNotLikeNu("zzzzsys_form"),
        "zzzzsys_format" => tableIdNotLikeNu("zzzzsys_format"),
        "zzzzsys_info" => tableIdNotLikeNu("zzzzsys_info"),
        "zzzzsys_note" => tableIdNotLikeNu("zzzzsys_note"),
        "zzzzsys_note_category" => tableIdNotLikeNu("zzzzsys_note_category"),
        "zzzzsys_object" => tableIdNotLikeNu("zzzzsys_object"),
        "zzzzsys_object_list" => tableIdNotLikeNu("zzzzsys_object_list"),
        "zzzzsys_php" => tableIdNotLikeNu("zzzzsys_php"),
        "zzzzsys_report" => tableIdNotLikeNu("zzzzsys_report"),
        "zzzzsys_report_data" => tableIdNotLikeNu("zzzzsys_report_data"),
        "zzzzsys_run_list" => tableIdNotLikeNu("zzzzsys_run_list"),
        "zzzzsys_select" => tableIdNotLikeNu("zzzzsys_select"),
        "zzzzsys_select_clause" => tableIdNotLikeNu("zzzzsys_select_clause"),
        "zzzzsys_setup" => tableIdNotLikeNu("zzzzsys_setup"),
        "zzzzsys_tab" => tableIdNotLikeNu("zzzzsys_tab"),
        "zzzzsys_timezone" => tableIdNotLikeNu("zzzzsys_timezone"),
        "zzzzsys_translate" => tableIdNotLikeNu("zzzzsys_translate"),
        "zzzzsys_user" => tableIdNotLikeNu("zzzzsys_user")
    ];


    $tableWheres = array_merge($tableWheresNotNu, $tableWheres);

}


$downloadFile = true;
$dumper->setTableWheres($tableWheres);

$dump_file = $PATH_MYSQLDUMP . nuSanitizeFilename($FILE_NAME);

// Start the dump
try {

    if (!is_dir($PATH_MYSQLDUMP)) {
        mkdir($PATH_MYSQLDUMP, 0755);
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

$dump_file = base64_encode($PATH_MYSQLDUMP . $FILE_NAME);

$js = "
   nuMessage(['<h2>Export completed!</h2><br>SQL Dump saved in ' + atob('$dump_file')]);
";

nuJavaScriptCallback($js);

function tableIdNotLikeNu($tableName) {
    return "$tableName" . "_id not like 'nu%'";
}

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