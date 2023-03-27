function wrapObjectsWithFieldset( containerClass, wrapperClass, startIdx, endIdx, legendText, fieldsetId) {
  if ( containerClass === '' || wrapperClass === '' || startIdx >= endIdx) {
    return;
  }

  var objects = $(' .' + containerClass + ' .' + wrapperClass);
  objects.slice(startIdx, endIdx).wrapAll('<fieldset data-nu-tab="0" class="' + fieldsetId + '"></fieldset>');
$('fieldset.' + fieldsetId).each(function(index) {
  $(this).prepend('<legend>' + legendText + '</legend>');
});
}


function nuOnLoad() {
if (nuFormType() == 'edit') {
 $(document).ready(function() {

    function isResponsive() {

        var f = window.nuFORM.getProperty('form_id');
        return f.containsAny(['nuaccess','nuhomecompact','nuuserhome','60ff227479f9950','nuuser']); // form B ,'nuhomecompact'

    }
    
    $(function(){
            $('legend').click(function(){
                $(this).parent().find('.nuObjectWrapper').slideToggle("slow");
            });
        });


           

    if (isResponsive() ) {
        

       var frmid = window.nuFORM.getProperty('form_id');

        var o = nuSERVERRESPONSE.objects;
        for (let i = 0; i < o.length; i++) {
            let id = o[i].id;
            let oType = o[i].type;


           
             if (o[i].read !== '2'&& o[i].tab == '0' ) {
                    $('#'+ id + ",#label_"+id).wrapAll("<div class='nuObjectWrapper' />");
                   
            }
            if (oType == 'lookup') {
                
                  $("#"+id+",#label_"+id+",#"+id+"code, #"+id+"button,#"+id+"description").wrapAll('<div  class="nuObjectWrapper nuLookupWrapper"></div>');
                  $("#"+id+"code, #"+id+"button,#"+id+"description , #sal_zzzzsys_form_id_open_button").wrapAll('<div class="nuLuWrapper"></div>');//, #sal_zzzzsys_form_id_open_button
                  
            }
            
            

            if (oType == 'file') {


                $("#label_"+id+",#"+id+",#"+id+"_file").wrapAll('<div class="nuObjectWrapper nuFileWrapper"></div>');
               
            }
            if (o[i].select2 == '1') {


                $("#label_"+id+",#"+id+", .select2").wrapAll('<div class="nuObjectWrapper"></div>');

            }
            if (o[i].input == 'button') {


                $("#"+id+"").not('#sal_zzzzsys_form_id_open_button').wrapAll('<div class="nuObjectWrapper nuRespButton"></div>');//02/02/23 Added Class:nuRespButton .not('#sal_zzzzsys_form_id_open_button')
        
             
            }
            
            

            if (o[i].tab === 0 && oType == 'subform') { //subforms in tab one only-responsive + scroll on small screens

                $("#label_"+id+",#"+id).wrapAll('<div class="nuObjectWrapper nuSubformWrapper"></div>');
                $("#"+id+",#label_"+id).css({
                    'top': '', 'left': '', 'width': '', 'position': ''
                   
                });
                 $("#"+id).css({
                    'overflow-x': 'auto'});

            } else if (o[i].tab != '0' && oType == 'subform') { //subform on other tabs are not wrapped and maintains its NB set positions + subforms are responsive
                    $("#"+id).css({
                     'width':'90vw','overflow-x':'auto'});
                     $("#label_"+id).css({
                     'top': parseInt($('#'+id).css("top"))-18, 'left': parseInt($('#'+id).css("left")) +0,'text-align': 'left' });
                     //other tabs subform labels are always on top
                 
              } else if (o[i].tab != '0') { //Other objects other tabs are not wrapped and maintains its NB set positions
             
                    $("#"+id).css({
                     'width':'50vw'}); //to be impelemented 
                     $("#label_"+id).css({
                     'top': parseInt($('#'+id).css("top"))-18, 'left': parseInt($('#'+id).css("left")) +0,'text-align': 'left' });
                     //can be changes based on preference  
                 
              
                     
            } else  {
                $("#"+id+",#label_"+id+",#"+id+"_file, .select2, span, .selection" ).css({'top':'','left':'','width':'','position':'','height':''});
                 $("#"+id+"code,#"+id+"button,#"+id+"description").css({'top':'','left':'','width':'','position':'','height':''});

            }


        }

        $(".nuObjectWrapper").wrapAll('<div class="nuContainer" id="nuContainer"></div>');
       
      
          $(".nuContentBoxContainer ").unwrap('.nuObjectWrapper').hide();
          $('.nuContentBox').unwrap('.nuObjectWrapper');
         $("#user_home,#run_user,edit_php, #menu_procedures, #user_add,#run_access,#run_setup, #menu_setup, #access_add,#form_button, #menu_forms,#object_button,#objects_add,#open_database, #menu_database,#run_filemanager,#run_sql, #sql_add,#run_file, #sql_file,#run_note, #notes_add,#edit_report, #menu_reports,#run_nucodesnippets, #nucodesnippets_add").unwrap();
         $("#user_home").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_user, #user_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_access, #access_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#form_button, #menu_forms").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#object_button,#objects_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#open_database, #menu_database").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_filemanager").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_sql, #sql_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_file, #sql_file").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_note, #notes_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#edit_report, #menu_reports").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_nucodesnippets, #nucodesnippets_add").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#edit_php, #menu_procedures").wrapAll('<div class="nuHomeRespButton"></div>');
         $("#run_setup, #menu_setup").wrapAll('<div class="nuHomeRespButton"></div>');
         
          $(".nuHomeRespButton").wrapAll('<div class="nuHomeButtonWrapper"></div>');
        // $(".nuHomeButtonWrapper").wrapAll('<fieldset></fieldset>');
        wrapObjectsWithFieldset('nuContainer', 'nuHomeButtonWrapper', 0, 20, '', 'Home');
       
              if (frmid == 'nuuser'){
                 
                wrapObjectsWithFieldset('nuContainer', 'nuObjectWrapper', 0, 7, 'Login', 'LoginFieldset');
                 //wrapObjectsWithFieldset('nuContainer', 'nuObjectWrapper', 0, 7, 'Login', 'LoginFieldset');
                wrapObjectsWithFieldset('nuContainer', 'nuObjectWrapper', 7, 20, 'Additional', 'AdditionalFieldset');
                

 }

 if (frmid == 'nuaccess'){
  wrapObjectsWithFieldset('nuContainer', 'nuObjectWrapper', 0, 10, 'nuaccess', 'nuaccess');
    //nuSetVerticalTabs();
 }   
  
 
        $(".nuContentBoxTitle").remove();
        $('div:empty').remove(); 
        

}




    // }
});


}
    
}
