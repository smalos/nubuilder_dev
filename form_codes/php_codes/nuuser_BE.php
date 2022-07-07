$add1Label  = isset($_SESSION['nubuilder_session_data']['USER_ADDITIONAL1_LABEL']) ? $_SESSION['nubuilder_session_data']['USER_ADDITIONAL1_LABEL'] : '';
$add2Label  = isset($_SESSION['nubuilder_session_data']['USER_ADDITIONAL2_LABEL']) ? $_SESSION['nubuilder_session_data']['USER_ADDITIONAL2_LABEL'] : '';
$addCode    = isset($_SESSION['nubuilder_session_data']['USER_CODE_LABEL']) ? $_SESSION['nubuilder_session_data']['USER_CODE_LABEL'] : '';

$j = "

    	if ('$add1Label'    !== '') { nuSetLabelText('sus_additional1', '$add1Label', true) };
    	if ('$add2Label'    !== '') { nuSetLabelText('sus_additional2', '$add2Label', true) };
    	if ('$addCode'      !== '') { nuSetLabelText('sus_code', '$addCode', true) };    	
    	
";

nuAddJavascript($j);