'use strict'

/**
 * JSON syntax highlighting transformation plugin
 */
AJAX.registerOnload('transformations/json.js', function () {
  const $elm = $('#page_content').find('code.json')
  $elm.each(function () {
    const $json = $(this)
    const $pre = $json.find('pre')
    /* We only care about visible elements to avoid double processing */

    if ($pre.is(':visible')) {
      const $highlight = $('<div class="json-highlight cm-s-default"></div>')
      $json.append($highlight)
      CodeMirror.runMode($json.text(), 'application/json', $highlight[0])
      $pre.hide()
    }
  })
})
