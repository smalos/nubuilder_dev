function nuOnLoad() {
if (nuFormType() == 'edit') {
 $(document).ready(function() {

    function isResponsive() {

        var f = window.nuFORM.getProperty('form_id');
        return f.containsAny(['60ff227479f9950', // Include form ID's Here
            '5ca15ca2410c298', '5ca123935de96df', '62b0e343864c838']); // form B

    }


    if (isResponsive()) {



        var o = nuSERVERRESPONSE.objects;
        for (let i = 0; i < o.length; i++) {
            let id = o[i].id;
            let oType = o[i].type;


           
             if (o[i].read !== '2'  ) {

                $('#'+ id).map(function(index) {

                    $(this).add($("label[for='"+this.id+"']")).wrapAll("<div class='form-element-wrapper' />");



                });
            }
            if (oType == 'lookup') {
                
                  $("#"+id+",#label_"+id+",#"+id+"code, #"+id+"button,#"+id+"description").wrapAll('<div id="lu" class="form-element-wrapper"></div>');
                  $("#"+id+"code, #"+id+"button,#"+id+"description").wrapAll('<div class="look"></div>');
                  
            }

            if (oType == 'file') {


                $("#label_"+id+",#"+id+",#"+id+"_file").wrapAll('<div id="file" class="form-element-wrapper"></div>');
               
            }
            if (o[i].select2 == '1') {


                $("#label_"+id+",#"+id+", .select2").wrapAll('<div class="form-element-wrapper"></div>');

            }
            if (o[i].input == 'button') {


                $("#"+id+"").wrapAll('<div id= "btn" class="form-element-wrapper"></div>');

            }

            if (oType == 'iframe' || oType == 'subform' || oType == 'run') {

                $("#label_"+id+",#"+id+"").wrapAll('<div id="subiframe" class="form-element-wrapper"></div>');
                $("#"+id+",#label_"+id+"").css({
                    'top': '', 'left': '', 'width': '', 'position': ''
                   
                });
                 $("#"+id+"").css({
                    'overflow-x': 'auto'});

            } else {
                $("#"+id+",#label_"+id+",#"+id+"_file, .select2, span, .selection" ).css({'top':'','left':'','width':'','position':'','height':''});
       $("#"+id+"code,#"+id+"button,#"+id+"description").css({'top':'','left':'','width':'','position':'','height':''});

            }


        }

        $(".form-element-wrapper").wrapAll('<div class="container"></div>');
      
         $(".nuContentBoxContainer").hide();
        $('div:empty').remove();
        $('.nuHiddenLookup').remove();



    }
});

}
    
}
