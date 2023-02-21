if (nuHash() ['GLOBAL_ACCESS'] == '0') return;

$sql = 'ALTER TABLE `#sob_all_table#` ADD ' . '#sql_query#';
$after = '#sql_after_column#';
if ($after != '') {
    $sql = $sql . " AFTER " . $after;
}

if (preg_match('[DELETE |DROP |INSERT |;]', strtoupper($sql))) {
    $r = - 2;
}
else {
    $r = nuRunQuery($sql, [] , true);
}

if ($r == 0) {
    $js = "nuMessage([nuTranslate('The column has been created successfully')]); nuRefreshSelectObject('sql_after_column');";
}
else if ($r == - 1) {
    $js = "nuMessage([nuTranslate('An error occured while creating the column'), nuTranslate('Check nuDebug Results for details')]);";

}
else if ($r == - 2) {
    $js = "nuMessage([nuTranslate('An error occured while creating the column'), nuTranslate('The query contains invalid keywords')]);";

}

nuJavaScriptCallback($js);
