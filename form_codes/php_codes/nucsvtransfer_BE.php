
function getCSVFiles() {

    $f = [];
    $dir = '../temp/';
    $dh = opendir($dir);
    while (false !== ($fileName = readdir($dh))) {
        $ext = substr($fileName, strrpos($fileName, '.') + 1);
        if (in_array($ext, [
            "txt",
            "csv",
            "tab",
            "asc"
        ])) $f[] = $fileName;
    }
    closedir($dh);
    return $f;
}

if ('csvfiles') {
    $f = getCSVFiles();
}
else {
    $f = [];

}

$a = [];

for ($i = 0;$i < count($f);$i++) {

    if ($f[$i][0] != '.') {
        $a[] = "'" . $f[$i] . "'";
    }
}

nuAddJavaScript("\n var nuCSVfiles = [" . implode(',', $a) . "];\n");

