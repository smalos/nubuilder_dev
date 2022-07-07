$lu = nuLookupRecord();
$type = empty($lu->run) ? '' : substr($lu->run, 0, 1);
nuSetFormValue('sob_run_type',  $type);