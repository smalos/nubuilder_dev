function tsSelectSingle (f) {
  $('#' + f).removeAttr('multiple')
  $('#' + f).attr('size', '5')
}

function addSelectedField () {
  const selFieldText = $('#emt_avail_fields').find('option:selected').text()
  insertAtCursor('emp_body', '#' + selFieldText + '#')
}

function insertAtCursor (myField, myValue) {
  const txt = $('#' + myField)
  const caretPos = txt[0].selectionStart
  const textAreaTxt = txt.val()
  const txtToAdd = myValue
  txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos))
}

function wrapText (elementID, openTag, closeTag) {
  const textArea = $('#' + elementID)
  const len = textArea.val().length
  const start = textArea[0].selectionStart
  const end = textArea[0].selectionEnd
  if (start !== end) {
    const selectedText = textArea.val().substring(start, end)
    const replacement = openTag + selectedText + closeTag
    textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len)).change()
  }
}

function formatText (tag) {
  wrapText('emp_body', '<' + tag + '>', '</' + tag + '>')
}

function formatText2 (tag) {
  wrapText('emp_body', tag, tag)
}

if (nuFormType() == 'edit') {
  $('#emt_avail_fields').nuLabelOnTop()
  tsSelectSingle('emt_avail_fields')
  setPreviewText()

  nuHide('emp_body_preview')

  /*
    $('#emp_body').bind('blur keyup', function () {
        setPreviewText();
    });
    */

  // Preview Button
  $('#textAreaPreviewDiv').hide()

  $('#togglepreview').click(function () {
    $(this).text(function (i, v) {
      return v == 'Preview' ? 'Close' : 'Preview'
    })

    setPreviewText()
    $('#emp_body').toggle()
    $('#textAreaPreviewDiv').toggle()
  })
}

function setPreviewText () {
  $('#textAreaPreviewDiv').html($('#emp_body').val().replace(/\n/g, '<br />'))
}
