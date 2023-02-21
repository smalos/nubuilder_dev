nuSetJSONDataAll('REFRESH_CACHE','1');
nuCreateViewsOrTables();

$js = "

nuGetBreadcrumb();

function msg() {
   nuMessage(nuTranslate('Cache Refreshed'));
}
setTimeout(msg, 1000); 

";

nuJavaScriptCallback($js);

