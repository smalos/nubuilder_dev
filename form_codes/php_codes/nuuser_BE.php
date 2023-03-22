$nubuilderSessionData = $_SESSION['nubuilder_session_data'];

$add1Label = $nubuilderSessionData['USER_ADDITIONAL1_LABEL'] ?? '';
$add2Label = $nubuilderSessionData['USER_ADDITIONAL2_LABEL'] ?? '';
$addCode = $nubuilderSessionData['USER_CODE_LABEL'] ?? '';

$js = "

    	if ('$add1Label') { nuSetLabelText('sus_additional1', '$add1Label', true) };
    	if ('$add2Label') { nuSetLabelText('sus_additional2', '$add2Label', true) };
    	if ('$addCode') { nuSetLabelText('sus_code', '$addCode', true) };
";

nuAddJavaScript($js);