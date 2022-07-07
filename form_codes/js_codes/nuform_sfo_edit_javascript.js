if ($('#zzzzsys_tab_sf000syt_access').val() !== '') {
  nuMessage(nuTranslate('The first tab must not be set to hidden'));
}

function nuDisplayObjectRefreshed(obj) {

  let v = nuGetValue(obj);
  if (v != '' &&  sfo_primary_key.value !== v) {
   nuSetValue('sfo_primary_key',v);
  }
}

nuAccessFormSetButtonIcons();