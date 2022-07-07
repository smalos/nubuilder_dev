nuShowFile()
nuSetToolTip('sfi_json_file_file', nuTranslate('Max. 300Kb'))

if (nuIsNewRecord()) {
  nuHide('view_image')
}

function nuBeforeSave () {
  const f = $('#sfi_json_file').val()

  if (f !== '') {
    $('#sfi_json')
      .val(f)
      .change()
  }

  return true
}

function nuShowFile () {
  const j = $('#sfi_json').val()

  nuEmbedObject(j, 'view_image', -1, -1) // auto-size
}
