
function getCSVFiles() {

    $f = array();
    $dir = '../temp/';
    $dh = opendir($dir);
    while (false !== ($fileName = readdir($dh))) {
        $ext = substr($fileName, strrpos($fileName, '.') + 1);
        if (in_array($ext, array(
            "txt",
            "csv",
            "tab",
            "asc"
        ))) $f[] = $fileName;
    }
    closedir($dh);
    return $f;
}

if ('csvfiles') {
    $f = getCSVFiles();
}
else {
    $f = array();

}

$a = array();

for ($i = 0;$i < count($f);$i++) {

    if ($f[$i][0] != '.') {
        $a[] = "'" . $f[$i] . "'";
    }
}

nuAddJavascript("\n var nuCSVfiles = [" . implode(',', $a) . "];\n");

