$r = nuLookupRecord();

if (isset($r->id)) {
    $tt	= nuTTList($r->id, 'nublank');				    //-- Field list from Temp table
    
    nuSetFormValue('fieldlist', json_encode($tt));
}
