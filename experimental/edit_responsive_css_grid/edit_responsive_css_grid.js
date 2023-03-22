
function nuOnLoad () {
  if (nuFormType() == 'edit') {
    $(document).ready(function () {
      function isResponsive () {
        const f = window.nuFORM.getProperty('form_id')
        return f.containsAny(['nuaccess', 'nuhomecompact', 'nuuserhome']) // form B ,'nuhomecompact'
      }

      if (isResponsive()) {
        const frmid = window.nuFORM.getProperty('form_id')

        const o = nuSERVERRESPONSE.objects
        for (let i = 0; i < o.length; i++) {
          const id = o[i].id
          const oType = o[i].type
          // nuContentBoxContainer

          if (o[i].read !== '2' && o[i].tab == '0') {
            $('#' + id + ',#label_' + id).wrapAll("<div class='nuObjectWrapper' />") // removed map for nuHomeRespButtoning
            // $('#'+ id).map(function(index) {
            // $(this).add($("label[for='"+this.id+"']")).wrapAll("<div class='nuObjectWrapper' />");
            // });
          }
          if (oType == 'lookup') {
            $('#' + id + ',#label_' + id + ',#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div  class="nuObjectWrapper nuLookupWrapper"></div>')
            $('#' + id + 'code, #' + id + 'button,#' + id + 'description , #sal_zzzzsys_form_id_open_button').wrapAll('<div class="nuLuWrapper"></div>') //, #sal_zzzzsys_form_id_open_button
          }

          if (oType == 'file') {
            $('#label_' + id + ',#' + id + ',#' + id + '_file').wrapAll('<div class="nuObjectWrapper nuFileWrapper"></div>')
          }
          if (o[i].select2 == '1') {
            $('#label_' + id + ',#' + id + ', .select2').wrapAll('<div class="nuObjectWrapper"></div>')
          }
          if (o[i].input == 'button') {
            $('#' + id + '').not('#sal_zzzzsys_form_id_open_button').wrapAll('<div class="nuObjectWrapper nuRespButton"></div>') // 02/02/23 Added Class:nuRespButton .not('#sal_zzzzsys_form_id_open_button')

            // $(".nuLookupButton").unwrap();
          }

          // if (frmid =='nuaccess' && oType == 'lookup'){
          //     $("#"+id+",#label_"+id+",#"+id+"code, #"+id+"button,#"+id+"description, #sal_zzzzsys_form_id_open_button").wrapAll('<div  class="nuObjectWrapper nuLookupWrapper"></div>');
          //     $("#"+id+"code, #"+id+"button,#"+id+"description").wrapAll('<div class="nuLuWrapper"></div>');

          // }

          if (o[i].tab === 0 && oType == 'subform') { // subforms in tab one only-responsive + scroll on small screens
            $('#label_' + id + ',#' + id + '').wrapAll('<div class="nuObjectWrapper nuSubformWrapper"></div>')
            $('#' + id + ',#label_' + id + '').css({
              top: '',
              left: '',
              width: '',
              position: ''

            })
            $('#' + id + '').css({
              'overflow-x': 'auto'
            })
          } else if (o[i].tab != '0' && oType == 'subform') { // subform on other tabs are not wrapped and maintains its NB set positions + subforms are responsive
            $('#' + id).css({
              width: '90vw',
              'overflow-x': 'auto'
            })
            $('#label_' + id).css({
              top: parseInt($('#' + id).css('top')) - 18,
              left: parseInt($('#' + id).css('left')) + 0,
              'text-align': 'left'
            })
            // other tabs subform labels are always on top
          } else if (o[i].tab != '0') { // Other objects other tabs are not wrapped and maintains its NB set positions
            $('#' + id).css({
              width: '50vw'
            }) // to be impelemented
            $('#label_' + id).css({
              top: parseInt($('#' + id).css('top')) - 18,
              left: parseInt($('#' + id).css('left')) + 0,
              'text-align': 'left'
            })
            // can be changes based on preference
          } else {
            $('#' + id + ',#label_' + id + ',#' + id + '_file, .select2, span, .selection').css({
              top: '',
              left: '',
              width: '',
              position: '',
              height: ''
            })
            $('#' + id + 'code,#' + id + 'button,#' + id + 'description').css({
              top: '',
              left: '',
              width: '',
              position: '',
              height: ''
            })
          }
        }

        $('.nuObjectWrapper').wrapAll('<div class="nuContainer"></div>')

        $('.nuContentBoxContainer').unwrap().hide()
        $('#user_home,#run_user,edit_php, #menu_procedures, #user_add,#run_access,#run_setup, #menu_setup, #access_add,#form_button, #menu_forms,#object_button,#objects_add,#open_database, #menu_database,#run_filemanager,#run_sql, #sql_add,#run_file, #sql_file,#run_note, #notes_add,#edit_report, #menu_reports,#run_nucodesnippets, #nucodesnippets_add').unwrap()
        $('#user_home').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_user, #user_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_access, #access_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#form_button, #menu_forms').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#object_button,#objects_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#open_database, #menu_database').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_filemanager').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_sql, #sql_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_file, #sql_file').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_note, #notes_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#edit_report, #menu_reports').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_nucodesnippets, #nucodesnippets_add').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#edit_php, #menu_procedures').wrapAll('<div class="nuHomeRespButton"></div>')
        $('#run_setup, #menu_setup').wrapAll('<div class="nuHomeRespButton"></div>')

        $('.nuHomeRespButton').wrapAll('<div class="nuHomeButtonWrapper"></div>')
        $('.nuHomeButtonWrapper').wrapAll('<fieldset></fieldset>')

        //  if (frmid == 'nuaccess'){

        //  	$(".nuObjectWrapper").wrapAll('<fieldset ></fieldset>');

        //  	$(".nuObjectWrapper").wrapAll('<fieldset></fieldset>');

        //  }

        $('.nuContentBoxTitle').remove()
        $('div:empty').remove()
      }
    })
  }
}
