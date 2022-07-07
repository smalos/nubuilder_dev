$i = '#hcname#';
$nj = '#hcvalue#';

nuSetProperty($i, $nj, true);


$js = "
    if(window.nuOnPropertySet){
        nuOnPropertySet('$i', '$nj');
    }
";

nuJavascriptCallback($js);
