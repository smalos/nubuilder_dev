$s = "SELECT sph_code, sph_php FROM `zzzzsys_php`";
$t = nuRunQuery($s);

while ($r = db_fetch_object($t)) {

    dumpFile('php_codes', $r->sph_code, $r->sph_php, '', "php");
}


$s = "SELECT sfo_code, sfo_javascript, sfo_browse_javascript, sfo_edit_javascript FROM `zzzzsys_form`";
$t = nuRunQuery($s);

while ($r = db_fetch_object($t)) {

    dumpFile('js_codes', $r->sfo_code, $r->sfo_javascript, 'sfo_javascript', "js");
    dumpFile('js_codes', $r->sfo_code, $r->sfo_edit_javascript, 'sfo_edit_javascript', "js");
    dumpFile('js_codes', $r->sfo_code, $r->sfo_browse_javascript, 'sfo_browse_javascript', "js");

}


function dumpFile($folder, $sfoCode, $code, $postfix, $extension) {

    $postfix = $postfix == '' ? '' : "_" . $postfix;

    $file = $sfoCode . $postfix . "." . $extension;


    if (strlen($code) > 0) {
        $dir = dirname(__DIR__, 1) . DIRECTORY_SEPARATOR. "codes". DIRECTORY_SEPARATOR .$folder . DIRECTORY_SEPARATOR . $file;
        file_put_contents($dir, $code);
    }
}