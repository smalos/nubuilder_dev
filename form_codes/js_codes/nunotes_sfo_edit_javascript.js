nuHide('label_not_title');
nuSetPlaceholder('not_title', nuTranslate('Title'));

nuHide('label_not_zzzzsys_note_category_id');
nuSetPlaceholder('not_zzzzsys_note_category_idcode', nuTranslate('Category'));

handleKeys();

function handleKeys() {

    $('#not_title').on('keydown', function(evt) {
      if (evt.key === 'Enter') {
        evt.preventDefault();        

        $('.ql-editor').focus();

        let tinyB = tinyMCE.get('not_content_container').getBody();
        if (tinyB !== null) tinyB.focus();

      }
    });

}

