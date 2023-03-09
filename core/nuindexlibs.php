<?php

function nuLoadBody($debug = false) {

		if ( !$debug ) {
				echo "<body id='nubody' onload='nuLoad()' onresize='nuResize()'>";
		} else {
				echo "<body>";
				echo "<pre>";
				print_r($_SESSION);
				print_r($_SERVER);
				print('<br>' . session_id());
				echo "</pre>";
		}
}


function nuGetJS_login($nuBrowseFunction, $target, $welcome, $formId, $recordId, $isSession) {

	$h2 = "function nuLoad(){
		nuBindCtrlEvents();
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';	
		";

	$h3 = "";

	if ($isSession) {
		$h3 = "nuForm('$formId','$recordId','','','','');";
	} else {	
		$h3 = "
			var welcome					= `$welcome`;
			nuLogin(welcome);
		";
	}

	$h4 = "}";

	return $h2.$h3.$h4;

}


function nuUseUP($nuBrowseFunction, $target, $welcome, $u, $p) {

	$h2 = "function nuLoad(){
		nuBindCtrlEvents();
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';
		var welcome						= `$welcome`;
		nuLoginRequest('$u', '$p');
	}";
	
	return $h2;
}

function nuGetJS_action_screen($nuBrowseFunction, $target, $welcome, $opener, $search, $like) {

	$h2 = "function nuLoad(){
		if(nuIsOpener(window)){
			var from		= window.opener;
		}else{
			var from		= window.parent;
		}
		window.nuFORM.caller			= from.nuFORM.getCurrent();
		nuFORM.tableSchema				= from.nuFORM.tableSchema;
		nuFORM.formSchema				= from.nuFORM.formSchema;
		window.nuDefaultBrowseFunction	= '$nuBrowseFunction';
		window.nuBrowseFunction			= '$nuBrowseFunction';
		window.nuTARGET					= '$target';
		window.nuSESSION				= from.nuSESSION;
		window.nuSuffix					= 1000;
		if('$opener' != '') {
			var p			= nuGetOpenerById(from.nuOPENER, Number($opener));
			nuRemoveOpenerById(from.nuOPENER, Number($opener));

		} else {
			var p			= from.nuOPENER[from.nuOPENER.length -1];
			nuRemoveOpenerById(from.nuOPENER, from.nuOPENER[from.nuOPENER.length -1]);
				
		}
		nuBindCtrlEvents();

		if(p.type == 'R') {
			nuRunReport(p.record_id, p.parameters);
		} else if(p.type == 'P') {
			nuRunPHP(p.record_id, p.parameters);
		} else {
			window.filter		= p.filter;
			window.nuFILTER		= p.filter;
			nuForm(p.form_id, p.record_id, p.filter, '$search', 0, '$like');
		}
		if(p.record_id == '-2'){
			nuBindDragEvents();		
		}
	}";
	
	return $h2;
} 

?>
