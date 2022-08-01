
function nuOnLoad () {
  if (nuFormType() == 'edit') {
    $(document).ready(function () {
      function isResponsive () {
        const f = window.nuFORM.getProperty('form_id')
        return f.containsAny(['60ff227479f9950']) // form B
      }

      if (isResponsive()) {
        const o = nuSERVERRESPONSE.objects
        for (let i = 0; i < o.length; i++) {
          const id = o[i].id
          const oType = o[i].type

          if (o[i].read !== '2' && o[i].tab == '0') {
            $('#' + id).map(function (index) {
              $(this).add($("label[for='" + this.id + "']")).wrapAll("<div class='form-element-wrapper' />")
            })
          }
          if (oType == 'lookup') {
            $('#' + id + ',#label_' + id + ',#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div id="lu" class="form-element-wrapper"></div>')
            $('#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div class="look"></div>')
          }

          if (oType == 'file') {
            $('#label_' + id + ',#' + id + ',#' + id + '_file').wrapAll('<div id="file" class="form-element-wrapper"></div>')
          }
          if (o[i].select2 == '1') {
            $('#label_' + id + ',#' + id + ', .select2').wrapAll('<div class="form-element-wrapper"></div>')
          }
          if (o[i].input == 'button') {
            $('#' + id + '').wrapAll('<div id= "btn" class="form-element-wrapper"></div>')
          }

          if (o[i].tab === 0 && oType == 'subform') { // subforms in tab one only-responsive + scroll on small screens
            $('#label_' + id + ',#' + id + '').wrapAll('<div id="subiframe" class="form-element-wrapper"></div>')
            $('#' + id + ',#label_' + id + '').css({
              top: '', left: '', width: '', position: ''

            })
            $('#' + id + '').css({ 'overflow-x': 'auto' })
          } else if (o[i].tab != '0' && oType == 'subform') { // subform on other tabs are not wrapped and maintains its NB set positions + subforms are responsive
            $('#' + id).css({ width: '90vw', 'overflow-x': 'auto' })
            $('#label_' + id).css({ top: parseInt($('#' + id).css('top')) - 18, left: parseInt($('#' + id).css('left')) + 0, 'text-align': 'left' })
            // other tabs subform labels are always on top
          } else {
            $('#' + id + ',#label_' + id + ',#' + id + '_file, .select2, span, .selection').css({ top: '', left: '', width: '', position: '', height: '' })
            $('#' + id + 'code,#' + id + 'button,#' + id + 'description').css({ top: '', left: '', width: '', position: '', height: '' })
          }
        }

        $('.form-element-wrapper').wrapAll('<div class="container"></div>')

        $('.nuContentBoxContainer').hide()
      }
    })
  }
}
