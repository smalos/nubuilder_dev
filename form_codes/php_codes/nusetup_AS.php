function writeVersionToFile($dbVersion, $filesVersion) {

    $f = fopen(__DIR__ . '/../version.txt', "w+") or die("Unable to open file!");
    fwrite($f, "nuBuilder Forte 4.5\n\n");
    fwrite($f, "DB Version: "."$dbVersion\n");
    fwrite($f, "Files Version: "."$filesVersion\n\n");
    fwrite($f, "(V.MajorVersion-CurrentDate.BuildNumber)");
    fclose($f);

}


$nuDevOde = '#nuDevMode#' == '1';

// Write Version Info

if ($nuDevOde) {

    $nuDumpCodes = nuProcedure('NUDUMPFORMCODES');
    eval($nuDumpCodes);

    $nuNewDBV = '#set_db_version_inc#';
    if ($nuNewDBV != '') {
        $qry = "UPDATE zzzzsys_info SET inf_details = ? WHERE  inf_code = 'nuDBVersion'";
        nuRunQuery($qry, array($nuNewDBV));
        $nuDBV = $nuNewDBV;
    } else {
        $nuDBV = '#set_db_version#';
    }

    $nuNewFilesV = '#set_files_version_inc#';
    if ($nuNewFilesV != '') {
        $qry = "UPDATE zzzzsys_info SET inf_details = ? WHERE  inf_code = 'nuFilesVersion'";
        nuRunQuery($qry, array($nuNewFilesV));
        $nuFilesV = $nuNewFilesV;
    } else {
        $nuFilesV = '#set_files_version#';
    }

    if ($nuNewFilesV != '' || $nuNewDBV != '') {
        writeVersionToFile($nuDBV, $nuFilesV);
    }

    if ('#set_dev_reset_tables#' == true) {

        $lang = array('["Afrikaans","Arabic","Armenian","Catalan","Chinese","Czech","Danish","Dutch","French","German","Greek","Hindi","Italian","Malay","Polish","Portuguese","Romanian","Russian","Spanish","Tamil","Vietnamese"]');
        nuRunQuery('UPDATE zzzzsys_setup SET set_languages_included = ?, set_language = NULL WHERE zzzzsys_setup_id = 1', $lang);

        $q = "
            DELETE FROM zzzzsys_user WHERE zzzzsys_user_id not like 'nu%';
            DELETE FROM zzzzsys_access WHERE zzzzsys_access_id not like 'nu%';
            DELETE FROM zzzzsys_access_form WHERE zzzzsys_access_form_id not like 'nu%';
            DELETE FROM zzzzsys_access_php WHERE zzzzsys_access_php_id not like 'nu%';
            DELETE FROM zzzzsys_access_report WHERE zzzzsys_access_report_id not like 'nu%';
            DELETE FROM zzzzsys_cloner WHERE zzzzsys_cloner_id not like 'nu%';
            DELETE FROM zzzzsys_file WHERE sfi_group <> 'nubuilder';
            DELETE FROM zzzzsys_format WHERE zzzzsys_format_id  not like 'nu%';
            DELETE FROM zzzzsys_note WHERE zzzzsys_note_id not like 'nu%';
            DELETE FROM zzzzsys_email_template WHERE zzzzsys_email_template_id  not like 'nu%';
            DELETE FROM zzzzsys_note_category WHERE zzzzsys_note_category_id not like 'nu%';
            DELETE FROM zzzzsys_select WHERE zzzzsys_select_id not like 'nu%';
            DELETE FROM zzzzsys_select_clause WHERE zzzzsys_select_clause_id not like 'nu%';
            DELETE FROM zzzzsys_php WHERE IFNULL(sph_php,'') = '';
            DELETE FROM zzzzsys_translate;
            UPDATE `zzzzsys_object` SET `sob_input_attribute` = NULL WHERE `sob_input_attribute` = '';
            UPDATE `zzzzsys_form` SET `sfo_browse_redirect_form_id` = '' WHERE `sfo_browse_redirect_form_id` IS NULL;
            UPDATE `zzzzsys_form` SET sfo_browse_javascript = NULL  WHERE TRIM(`sfo_browse_javascript`) = '';
            UPDATE `zzzzsys_form` SET sfo_javascript = NULL  WHERE TRIM(`sfo_javascript`) = '';
            UPDATE `zzzzsys_tab` SET `syt_access` = NULL  WHERE TRIM(`syt_access`) = '';
            UPDATE `zzzzsys_form` SET `sfo_browse_row_height` = 0 WHERE `sfo_browse_row_height` IS NULL;
            UPDATE `zzzzsys_form` SET `sfo_browse_rows_per_page` = 0 WHERE `sfo_browse_rows_per_page` IS NULL;
            DELETE FROM zzzzsys_debug;
            DELETE FROM zzzzsys_session;
        ";

        nuRunQuery($q);


    }

}

function nuImportSelectedLanguageFiles($l) {
    try {
        for ($i = 0; $i < count($l); $i++) {
            if (trim($l[$i]) == '') continue;
            $file = dirname(__FILE__). '/languages/'. $l[$i].'.sql';
            $sql = file_get_contents($file);
            if ($sql) {
                nuRunQuery($sql);
            } else {
                nuDisplayError("Error opening the file: $file");
            }
        }
    }catch (Exception $e) {
        nuDisplayError(nuTranslate('<h2>'.nuTranslate('Error').'</h2><br>Error while importing language files.'));
    }
}


// Include/Exclude languages
$t = "#set_languages_included_json#";

if ($t != '-1') {
    // no language change

    nuRunQuery("DELETE FROM zzzzsys_translate WHERE zzzzsys_translate_id LIKE 'nu%'");
    if ($t != '') nuImportSelectedLanguageFiles(json_decode($t));

}


if ("#set_language_current#" != "#set_language#") {
    $_SESSION['nubuilder_session_data']['translation'] = nuGetTranslation("#set_language#");
}

// Check if header textarea changed

if ("#set_header_current#" != "#set_header#") {
    nuDisplayError(nuTranslate('<h2>'.nuTranslate('Information').'</h2><br>You will need to log in again for the changes to take effect.'));
}