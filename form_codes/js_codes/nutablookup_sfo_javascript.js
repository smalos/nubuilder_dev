function getParentFormCode() {
    
    return parent.parent.nuCurrentProperties().form_code;
    
}

if(nuFormType() == 'browse'){
    
    if ( getParentFormCode() !== 'nuobject' && window.filtered !== 1) {
       nuAddActionButton('nuFilterCurrentForm', 'Current Form only', 'nuSearchAction("", "'+getParentFormCode()+'");window.filtered = 1;');            
    }

    //-- run as the Form is loaded      

    $("[data-nu-column='3']").each(function() {
        $(this).addClass('nu_'+this.textContent);
    });
    
    $('#nuAddButton').remove();
    $('#nuPrintButton').remove();


}
    

