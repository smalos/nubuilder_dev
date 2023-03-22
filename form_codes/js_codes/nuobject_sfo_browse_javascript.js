let a = [['', ''], ['calc', 'Calc'], ['display', 'Display'], ['contentbox', 'ContentBox'], ['editor', 'WYSIWYG Editor'], ['html', 'HTML'], ['image', 'Image'], ['input', 'Input'], ['lookup', 'Lookup'], ['run', 'Run'], ['select', 'Select'], ['subform', 'Subform'], ['textarea', 'Textarea'], ['word', 'Word']]
nuAddBrowseTitleSelect(0, a)

$('#nuBrowseTitle9_select').parent().unbind('touchstart')

a = [['', ''], ['nuDate', 'nuDate'], ['nuNumber', 'nuNumber'], ['nuScroll', 'nuScroll'], ['nuAutoNumber', 'nuAutoNumber'], ['button', 'Button'],
  ['checkbox', 'Checkbox'], ['color', 'Color'], ['datetime-local', 'Datetime-Local'], ['email', 'Email'], ['file', 'File'],
  ['image', 'Image'], ['month', 'Month'], ['number', 'Number'], ['password', 'Password'], ['radio', 'Radio'], ['range', 'Range'],
  ['reset', 'Reset'], ['search', 'Search'], ['tel', 'Telephone'], ['text', 'Text'], ['time', 'Time'], ['url', 'URL'], ['week', 'Week']]

nuAddBrowseTitleSelect(1, a)
$('#nuBrowseTitle1_select').parent().unbind('touchstart')

$("[data-nu-column='0']").each(function () {
  $(this).addClass('nu_' + this.textContent).addClass('nuCellColored')
})

$("[data-nu-column='4']").each(function () {
  $(this).html(stripHTMLTags($(this).html()).replace(/&nbsp;/g, ' ').trim())
})

function stripHTMLTags (s) {
  return s == '' ? '' : s.replace(/<\/?[^>]+(>|$)/g, '')
}
