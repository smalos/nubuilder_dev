
function nuOnLoad () {
  if (nuFormType() == 'edit') {
    $(document).ready(function () {
      function isResponsive () {
        const f = window.nuFORM.getProperty('form_id')
        return f.containsAny(['62e0bfe9ea011c7']) // form B
      }

      if (isResponsive()) {
        const o = nuSERVERRESPONSE.objects
        for (let i = 0; i < o.length; i++) {
          const id = o[i].id
          const oType = o[i].type

          if (o[i].read !== '2' && o[i].tab == '0') {
            $('#' + id + ',#label_' + id).wrapAll("<div class='nuObjectWrapper' />") // removed map for testing
            // $('#'+ id).map(function(index) {

            //     $(this).add($("label[for='"+this.id+"']")).wrapAll("<div class='nuObjectWrapper' />");

            // });
          }
          if (oType == 'lookup') {
            $('#' + id + ',#label_' + id + ',#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div  class="nuObjectWrapper nuLookupWrapper"></div>')
            $('#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div class="nuLuWrapper"></div>')
          }

          if (oType == 'file') {
            $('#label_' + id + ',#' + id + ',#' + id + '_file').wrapAll('<div class="nuObjectWrapper nuFileWrapper"></div>')
          }
          if (o[i].select2 == '1') {
            $('#label_' + id + ',#' + id + ', .select2').wrapAll('<div class="nuObjectWrapper"></div>')
          }
          if (o[i].input == 'button') {
            $('#' + id + '').wrapAll('<div id= "btn" class="nuObjectWrapper"></div>')
          }

          if (o[i].tab === 0 && oType == 'subform') { // subforms in tab one only-responsive + scroll on small screens
            $('#label_' + id + ',#' + id + '').wrapAll('<div class="nuObjectWrapper nuSubformWrapper"></div>')
            $('#' + id + ',#label_' + id + '').css({
              top: '', left: '', width: '', position: ''

            })
            $('#' + id + '').css({ 'overflow-x': 'auto' })
          } else if (o[i].tab != '0' && oType == 'subform') { // subform on other tabs are not wrapped and maintains its NB set positions + subforms are responsive
            $('#' + id).css({ width: '90vw', 'overflow-x': 'auto' })
            $('#label_' + id).css({ top: parseInt($('#' + id).css('top')) - 18, left: parseInt($('#' + id).css('left')) + 0, 'text-align': 'left' })
            // other tabs subform labels are always on top
          } else if (o[i].tab != '0') { // Other objects other tabs are not wrapped and maintains its NB set positions
            $('#' + id).css({ width: '50vw' }) // to be impelemented
            $('#label_' + id).css({ top: parseInt($('#' + id).css('top')) - 18, left: parseInt($('#' + id).css('left')) + 0, 'text-align': 'left' })
            // can be changes based on preference
          } else {
            $('#' + id + ',#label_' + id + ',#' + id + '_file, .select2, span, .selection').css({ top: '', left: '', width: '', position: '', height: '' })
            $('#' + id + 'code,#' + id + 'button,#' + id + 'description').css({ top: '', left: '', width: '', position: '', height: '' })
          }
        }

        $('.nuObjectWrapper').wrapAll('<div class="nuContainer"></div>')

        $('div:empty').remove()
        $('.nuContentBoxContainer').hide()
      }
    })
  }
}
