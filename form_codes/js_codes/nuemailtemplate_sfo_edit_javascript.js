nuLabelOnTop(['emt_form_id']);
activeObj = $('#emt_body');

$('#emt_avail_fields').nuLabelOnTop();
selectSingle('emt_avail_fields');

setPreviewText();
    
function selectSingle(f) {
    $('#' + f).removeAttr('multiple');
    $('#' + f).attr('size', '5');
}

function addSelectedField() {
    const selObjectId = nuGetValue('emt_avail_fields', 'text');
    const selObjectLabel = nuGetValue('emt_avail_fields');
    if (selObjectId !== '') {
        const activeObjectId = getActiveObjectId();
        const isBody = activeObjectId == 'emt_body';
        const label = isBody ? '<b>' + selObjectLabel + ': </b>': '';
        insertAtCursor(activeObjectId, label + "#" + selObjectId + "#" + (isBody ? '\n' : ''));
    }
}

function insertAtCursor(myField, myValue) {
    const txt = $('#' + myField);
    const caretPos = txt[0].selectionStart;
    const textAreaTxt = txt.val();
    const txtToAdd = myValue;
    txt.val(textAreaTxt.substring(0, caretPos) + txtToAdd + textAreaTxt.substring(caretPos));
    txt.focus();
    const endOfText = caretPos + txtToAdd.length;
    txt.prop('selectionStart', endOfText);
    txt.prop('selectionEnd', endOfText);
}

function wrapText(elementID, openTag, closeTag) {
    const textArea = $('#' + elementID);
    const len = textArea.val().length;
    const start = textArea[0].selectionStart;
    const end = textArea[0].selectionEnd;
    if (start !== end) {
        var selectedText = textArea.val().substring(start, end);
        var replacement = openTag + selectedText + closeTag;
        textArea.val(textArea.val().substring(0, start) + replacement + textArea.val().substring(end, len)).change();
    }
}

function getActiveObjectId() {
    return activeObj.attr('id');
}

function formatText(tag) {
    wrapText(getActiveObjectId(), '<' + tag + '>', '</' + tag + '>');
}

function formatText2(tag) {
    wrapText(getActiveObjectId(), tag, tag);
}

function setPreviewText() {
    $('#textAreaPreviewDiv').html($('#emt_body').val().replace(/\n/g, '<br />'));
}