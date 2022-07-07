$justphp = nuObjKey(nuHash(),'filter') == 'justphp';

if ('#nuDevMode#' != 1 && substr('#RECORD_ID#', 0, 2) === 'nu' ) {
   if ($justphp) {
        nuDisplayError(nuTranslate('<h2>'.nuTranslate('Information').'</h2><br>Changes in system forms are overwritten with an update'));  
   } 
}