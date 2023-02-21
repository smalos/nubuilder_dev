function nuGetDisplayValue($formId, $obj) {

    $sql = "SELECT sob_display_sql FROM `zzzzsys_object` WHERE sob_all_zzzzsys_form_id = ? AND sob_all_id = ?";

    $t = nuRunQuery($sql, [$formId, $obj]);

    if (db_num_rows($t) == 1) {
        $r = db_fetch_row($t);
        if ($r != false) {

            $disS = nuReplaceHashVariables($r[0]);
            $disT = nuRunQuery($disS);

            if (db_num_rows($disT) >= 1) {
                $disR = db_fetch_row($disT);
                return $disR[0];
            } else {
                return "";
            }
        }
    }

    return false;
}

function nuRefreshDisplayObject($displayId, $formId, $prefix) {

    if (hashCookieNotSetOrEmpty($formId)) {
        $formId = '#form_id#';
    }

    $prefix = hashCookieNotSetOrEmpty($prefix) ? '' : $prefix;
	$formId = '#nurefreshdisplayobject_formid#';

	if (hashCookieNotSetOrEmpty($formId)) {
		$formId = '#form_id#';
	}
    
	$value = nuGetDisplayValue($formId, $displayId);
	$displayId = $prefix.$displayId;
		
	if ($value === false && $value !== '') {
		$js = "nuMessage([nuTranslate('Failed to refresh the Display Object: ') + '$displayId']); ";
	} else {

		$js = " 
			var obj = $('#$displayId');
			var format = obj.attr('data-nu-format');
			var v = nuFORM.addFormatting('$value', format);
			obj.val(v).change();
			
			if (window.nuDisplayObjectRefreshed) {
				nuDisplayObjectRefreshed('$displayId', '$formId');
			}
		";
	}
    
    nuJavaScriptCallback($js);

}

nuRefreshDisplayObject('#NUREFRESHDISPLAYOBJECT_displayid#', '#NUREFRESHDISPLAYOBJECT_formid#','#NUREFRESHDISPLAYOBJECT_prefix#');