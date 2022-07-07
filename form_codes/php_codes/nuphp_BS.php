$justphp = nuObjKey(nuHash(),'filter') == 'justphp';

if ('#nuDevMode#' != 1 && substr('#RECORD_ID#', 0, 2) === 'nu' ) {
   if (! $justphp) {
        nuDisplayError(nuTranslate("Templates cannot be saved. Clone it instead."));
   } 
}