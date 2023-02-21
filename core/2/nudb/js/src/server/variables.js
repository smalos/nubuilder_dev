/**
 * @fileoverview    Javascript functions used in server variables page
 * @name            Server Replication
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 */
/**
 * Unbind all event handlers before tearing down a page
 */
AJAX.registerTeardown('server/variables.js', function () {
  $(document).off('click', 'a.editLink')
  $('#serverVariables').find('.var-name').find('a img').remove()
})

AJAX.registerOnload('server/variables.js', function () {
  const $saveLink = $('a.saveLink')
  const $cancelLink = $('a.cancelLink')

  $('#serverVariables').find('.var-name').find('a').append(
    $('#docImage').clone().css('display', 'inline-block')
  )

  /* Launches the variable editor */
  $(document).on('click', 'a.editLink', function (event) {
    event.preventDefault()
    editVariable(this)
  })

  /* Allows the user to edit a server variable */
  function editVariable (link) {
    const $link = $(link)
    const $cell = $link.parent()
    const $valueCell = $link.parents('.var-row').find('.var-value')
    const varName = $link.data('variable')

    const $mySaveLink = $saveLink.clone().css('display', 'inline-block')
    const $myCancelLink = $cancelLink.clone().css('display', 'inline-block')
    const $msgbox = Functions.ajaxShowMessage()
    const $myEditLink = $cell.find('a.editLink')
    $cell.addClass('edit') // variable is being edited
    $myEditLink.remove() // remove edit link

    $mySaveLink.on('click', function () {
      const $msgbox = Functions.ajaxShowMessage(Messages.strProcessingRequest)
      $.post('index.php?route=/server/variables/set/' + encodeURIComponent(varName), {
        ajax_request: true,
        server: CommonParams.get('server'),
        varValue: $valueCell.find('input').val()
      }, function (data) {
        if (data.success) {
          $valueCell
            .html(data.variable)
            .data('content', data.variable)
          Functions.ajaxRemoveMessage($msgbox)
        } else {
          if (data.error === '') {
            Functions.ajaxShowMessage(Messages.strRequestFailed, false)
          } else {
            Functions.ajaxShowMessage(data.error, false)
          }
          $valueCell.html($valueCell.data('content'))
        }
        $cell.removeClass('edit').html($myEditLink)
      })
      return false
    })

    $myCancelLink.on('click', function () {
      $valueCell.html($valueCell.data('content'))
      $cell.removeClass('edit').html($myEditLink)
      return false
    })

    $.get('index.php?route=/server/variables/get/' + encodeURIComponent(varName), {
      ajax_request: true,
      server: CommonParams.get('server')
    }, function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        const $links = $('<div></div>')
          .append($myCancelLink)
          .append('&nbsp;&nbsp;&nbsp;')
          .append($mySaveLink)
        const $editor = $('<div></div>', { class: 'serverVariableEditor' })
          .append(
            $('<div></div>').append(
              $('<input>', { type: 'text', class: 'form-control form-control-sm' }).val(data.message)
            )
          )
        // Save and replace content
        $cell
          .html($links)
          .children()
          .css('display', 'flex')
        $valueCell
          .data('content', $valueCell.html())
          .html($editor)
          .find('input')
          .trigger('focus')
          .on('keydown', function (event) { // Keyboard shortcuts
            if (event.keyCode === 13) { // Enter key
              $mySaveLink.trigger('click')
            } else if (event.keyCode === 27) { // Escape key
              $myCancelLink.trigger('click')
            }
          })
        Functions.ajaxRemoveMessage($msgbox)
      } else {
        $cell.removeClass('edit').html($myEditLink)
        Functions.ajaxShowMessage(data.error)
      }
    })
  }
})
