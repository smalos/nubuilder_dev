// $('#nuBreadcrumbHolder').remove();
$('#nuActionHolder').remove()
// $('#nuTabHolder').remove();

$('#nuOptions').hide()

$('#inputtextsample').val('text')
$('#inputnumbersample').val(4)
$('#inputnunumbersample').val('$ 1,234.56')
$('#inputnudatesample').val('23-Jan-2021')
$('#inputnuscrollsample').val('East')
$('#calcsample').val('$ 1,238.56')

$('#selectsample').val(1)
$('#selectmultiselectsample').val(0)
$('#textareasample').val('text-area')

$("[id^='label']").addClass('nu_input').css({ width: 120, left: 10, 'text-align': 'center' })

$('#label_imagesample').addClass('nu_image').removeClass('nu_input')
$('#label_textareasample').addClass('nu_textarea').removeClass('nu_input')
$('#label_displaysample').addClass('nu_display').removeClass('nu_input')
$('#label_htmlsample').addClass('nu_html').removeClass('nu_input')
$('#label_calcsample').addClass('nu_calc').removeClass('nu_input')
$('#label_selectsample').addClass('nu_select').removeClass('nu_input')
$('#label_selectmultiselectsample').addClass('nu_select').removeClass('nu_input')
$('#label_lookupsample').addClass('nu_lookup').removeClass('nu_input')
$('#labelword').addClass('nu_word').removeClass('nu_input')
$('#label_subformsample').addClass('nu_subform').removeClass('nu_input').css({ left: 10 })

$("[id^='label']")
  .addClass('nuCalculatorButton')
  .removeClass('nuWord')
  .css({ height: 30, width: 220 })
