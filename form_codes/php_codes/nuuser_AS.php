if ('#check_password#' != '') {

    $userId = "#RECORD_ID#";

    if ($_SESSION['nubuilder_session_data']['USE_MD5_PASSWORD_HASH'] != true) {
        $pw = nuPasswordHash('#check_password#');
    } else {
        $pw = md5('#check_password#');
    }

    nuRunQuery("UPDATE zzzzsys_user SET sus_login_password = '$pw' WHERE zzzzsys_user_id = ?", [$userId]);

    nuSetUserJSONData('PASSWORD_CHANGED_TIME', time(), $userId);
    nuSetUserJSONData('PASSWORD_CHANGED_SOURCE', 'admin', $userId);

}