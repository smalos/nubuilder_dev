$devMode = nuReplaceHashVariables("#nuDevMode#");

$t = $devMode == '1' ? '_Template' : '';

$p  = nuProcedure('nuAuthentication2FA'.$t);	

if($p != '') { 
    eval($p); 
} else {
    nuDisplayError(nuTranslate('The Procedure nuAuthentication2FA does not exist.'));    
}





