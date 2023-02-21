$name = '#NUSETHASHCOOKIE_NAME#';
$value = '#NUSETHASHCOOKIE_VALUE#';

nuSetProperty($name, $value, true);


$js = "
    if(window.nuOnPropertySet){
        nuOnPropertySet('$name', '$value');
    }
";

nuJavaScriptCallback($js);
