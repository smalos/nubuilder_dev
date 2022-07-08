function openNuObject () {
  $('#nuMessageDiv').remove()
  nuPopup('nuobject', '-1', window.nuFORM.getCurrent().form_id, '')
}

if (nuSERVERRESPONSE.objects.length === 0 && window.global_access) {
  const headings = '<h2>' + nuTranslate('Information') + '<h2>'
  const message = nuTranslate('Currently there are no objects on this Form') + '. <a href="javascript:openNuObject();">' + nuTranslate('Start adding some') + '</a>.'
  nuMessage([headings, message])
}
