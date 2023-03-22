if (nuIsIframe()) {
    var btn = nuAddActionButton('runCategories', '', 'nuForm("' + nuFormId() + '", "", "", "", 2);');
    btn.attr('title', nuTranslate('Edit Categories'));
    nuAttachFontAwesome(btn.attr('id'), 'fa-solid fa-list');
}