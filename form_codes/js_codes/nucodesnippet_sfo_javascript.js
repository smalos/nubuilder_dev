if (nuFormType() == 'edit') {

    var sc = $('#cot_source_code');
    sc.addClass('js');

    sc.css('padding', '3px 3px 3px 3px')

    // Add ACE event handlers
    sc .dblclick(function() {
         nuOpenAce(nuGetSourceLangage(), this.id);
    });

   // Code Snippets form
   nuSetProperty('IS_SETUP_HEADER',0);
   nuSetProperty('IS_CUSTOM_CODE',1);

    // Disable nu-records
    if (nuCurrentProperties().record_id.startsWith('nu')) {
      nuDisableAllObjects();
      $('#nuSaveButton').hide();
    }

}

function nuOnClone(){
      nuEnableAllObjects();
      $('#nuSaveButton').show();
}


function nuGetSourceLangage() {
    
    var l = $('#cot_language').val();
    return l === '' ? 'Javascript' : l;
    
}

