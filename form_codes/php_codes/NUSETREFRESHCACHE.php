nuSetJSONDataAll('REFRESH_CACHE','1');

$js = "

nuGetBreadcrumb();

function msg() {
   nuMessage(nuTranslate('Cache Refreshed'));
}
setTimeout(msg, 1000); 

";

nuJavascriptCallback($js);

