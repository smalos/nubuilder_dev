
function nuBindDragEvents () {
  $(document).on('mousemove.nuformdrag', function (e) {
    let draggable 		= 0

    if (window.nuFORM.breadcrumbs.length != -1) {
      if (window.nuFORM.getProperty('record_id') == '-2') {
        draggable 	= 1
      }
    }

    if (draggable) {
      if (e.stopPropagation) e.stopPropagation()
      if (e.preventDefault) e.preventDefault()

      e.cancelBubble	= true
      e.returnValue	= false

      if (e.buttons) {
        nuDragBox(e)
      }
    }
  })

  $(document).on('mousedown.nuformdrag', function (e) {
    window.startX 		= e.clientX + window.scrollX
    window.startY 		= e.clientY + window.scrollY
    window.moveX 		= 0
    window.moveY 		= 0

    let draggable 		= 0

    if (window.nuFORM.last != -1) {
      if (window.nuFORM.getProperty('record_id') == '-2') {
        draggable 	= 1
      }
    }

    if (draggable) {
      if (e.target === document.body || e.target === $('#nuRECORD')[0]) {
        if (!e.ctrlKey) {
          $('.nuDragSelected').removeClass('nuDragSelected')
        }

        nuCreateBox(e)
      } else {
        if (!e.ctrlKey && !$('#' + e.target.id).hasClass('nuDragSelected')) {
          $('.nuDragSelected').removeClass('nuDragSelected')
        }

        if ($('#' + e.target.id).attr('data-drag')) {
          $('#' + e.target.id).addClass('nuDragSelected')
        }
      }
    }

    nuUpdateDragFieldsListbox()
  })

  $(document).on('mouseup.nuformdrag', function (e) {
    let draggable 		= 0

    if (window.nuFORM.last != -1) {
      if (window.nuFORM.getProperty('record_id') == '-2') {
        draggable 	= 1
      }
    }

    if (draggable) {
      if ($('#nuSelectBox').length > 0) {
        nuRemoveBox(e.ctrlKey)
      }
    }

    nuUpdateDragFieldsListbox()
  })

  const nuDragKeydownListener = function (e) {
    let keyDirection = ''

    if (e.keyCode == 37) {
      keyDirection 	= 'left'
    } else if (e.keyCode == 39) {
      keyDirection 	= 'right'
    } else if (e.keyCode == 38) {
      keyDirection 	= 'up'
    } else if (e.keyCode == 40) {
      keyDirection 	= 'down'
    }

    if (keyDirection != '') {
      $('div.nuDragSelected').each(function () {
        let prop	= ''
        let val 	= ''

        if (keyDirection == 'left') {
          if (e.shiftKey) {
            prop = 'width'
            val = $(this).width() - 1
          } else {
            prop = 'left'
            val = $(this).position().left - 1
          }
        } else if (keyDirection == 'right') {
          if (e.shiftKey) {
            prop = 'width'
            val	= $(this).width() + 1
          } else {
            prop = 'left'
            val = $(this).position().left + 1
          }
        } else if (keyDirection == 'up') {
          if (e.shiftKey) {
            prop = 'height'
            val = $(this).height() - 1
          } else {
            prop = 'top'
            val = $(this).position().top - 1
          }
        } else if (keyDirection == 'down') {
          if (e.shiftKey) {
            prop = 'height'
            val = $(this).height() + 1
          } else {
            prop = 'top'
            val = $(this).position().top + 1
          }
        }

        $(this).css(prop, val + 'px')
      })
    }
  }

  $(document).on('keydown.nuformdrag', nuDragKeydownListener)
  $(window.parent.document).on('keydown.nuformdrag', nuDragKeydownListener)
}

function nuUnbindDragEvents () {
  $(document).off('.nuformdrag')
}

function nuUpdateDragFieldsListbox () {
  $('#nuDragOptionsFields option:selected', window.parent.document.body).prop('selected', false)

  $('.nuDragSelected').each(function () {
    $('#nuDragOptionsFields option[id="drag_' + $(this).prop('id') + '"]', window.parent.document.body).prop('selected', 'selected')
  })

  nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields', window.parent.document.body))
  nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields', window.parent.document.body))
}

function nuCreateBox (event) {
  const e 			= document.createElement('div')

  e.setAttribute('id', 'nuSelectBox')

  $('body').append(e)

  $('#' + e.id).css({
    width: 1,
    height: 1,
    top: event.clientY + window.scrollY,
    left: event.clientX,
    position: 'absolute',
    'border-style': 'dashed',
    'border-width': 1,
    'border-color': 'red',
    'z-index': '4000',
    'background-color': 'transparent'
  })
}

function nuDragBox (event) {
  window.lastMoveX 	= window.moveX
  window.lastMoveY 	= window.moveY
  window.moveX 		= event.clientX - window.startX
  window.moveY 		= event.clientY - window.startY

  if ($('#nuSelectBox').length > 0) {
    nuResizeDrag(event)
  } else {
    if ($('#nuSelectBox').length == 0 && nuCanMove()) {
      nuMoveSelected()
    }
  }
}

function nuResizeDrag (event) {
  const x = parseInt($('#nuSelectBox').css('left'))
  const y = parseInt($('#nuSelectBox').css('top'))
  const w = parseInt($('#nuSelectBox').css('width'))
  const h = parseInt($('#nuSelectBox').css('height'))

  const X = event.clientX - window.startX
  const Y = event.clientY + window.scrollY - window.startY

  if (X > 0) {
    $('#nuSelectBox').css({
      width: X
    })
  } else {
    $('#nuSelectBox').css({
      width: -1 * X,
      left: window.startX + X
    })
  }

  if (Y > 0) {
    $('#nuSelectBox').css({
      height: Y
    })
  } else {
    $('#nuSelectBox').css({
      height: -1 * Y,
      top: window.startY + Y
    })
  }
}

function nuRemoveBox (ctrlKey) {
  const L			= parseInt($('#nuSelectBox').css('left'))
  const T			= parseInt($('#nuSelectBox').css('top')) - nuGetTopArea()
  const B			= T + parseInt($('#nuSelectBox').css('height'))
  const R			= L + parseInt($('#nuSelectBox').css('width'))

  $('#nuSelectBox').remove()

  const o = $('[data-drag]')

  if (!ctrlKey) {
    $('.nuDragSelected').removeClass('nuDragSelected')
  }

  const selectedTab = $('.nuTabSelected')[0].id.substring(5)

  o.each(function (index) {
    if ($(this).attr('data-nu-tab') == selectedTab) {
      const l	=		parseInt($(this).css('left'))
      const t	=		parseInt($(this).css('top'))
      const b	= t +	parseInt($(this).css('height'))
      const r	= l +	parseInt($(this).css('width'))

      // drag around selected objects points
      if (l >= L && l <= R && t >= T && t <= B) {
        $(this).addClass('nuDragSelected')
      } else if (r >= L && r <= R && t >= T && t <= B) {
        $(this).addClass('nuDragSelected')
      } else if (l >= L && l <= R && b >= T && b <= B) {
        $(this).addClass('nuDragSelected')
      } else if (r >= L && r <= R && b >= T && b <= B) {
        $(this).addClass('nuDragSelected')
      }

      // drag within selected objects points
      if (L >= l && L <= r && T >= t && T <= b) {
        $(this).addClass('nuDragSelected')
      } else if (R >= l && R <= r && T >= t && T <= b) {
        $(this).addClass('nuDragSelected')
      } else if (L >= l && L <= r && B >= t && B <= b) {
        $(this).addClass('nuDragSelected')
      } else if (R >= l && R <= r && B >= t && B <= b) {
        $(this).addClass('nuDragSelected')
      }

      // drag through object but not through any points
      if (L >= l && L <= r && T <= t && B >= b) {
        $(this).addClass('nuDragSelected')
      } else if (L <= l && R >= r && T >= t && B <= b) {
        $(this).addClass('nuDragSelected')
      }
    }
  })
}

function nuInitialiseDragState () {
  window.nuDragOptionsState 		= { tabs: [] }

  let tabOrderCounter				= 10

  $('div.nuTab[id^="nuTab"]').each(function () {
    const objects = {
      tab_id: $(this).attr('data-nu-tab-id'),
      objects: []
    }

    $('div#nuRECORD div[data-nu-tab="' + $(this).prop('id').replace('nuTab', '') + '"]').each(function () {
      const objectPosition		= $(this).position()

      const objectProperties	= {

        object_id: $(this).attr('data-nu-object-id'),
        id: $(this).prop('id'),
        left: objectPosition.left,
        top: objectPosition.top,
        width: $(this).width(),
        height: $(this).height(),
        tab_order: tabOrderCounter

      }

      objects.objects.push(objectProperties)
      tabOrderCounter 		= tabOrderCounter + 10
    })

    window.nuDragOptionsState.tabs.push(objects)
  })
}

function nuSetTabOrderDataAttrs () {
  const currentTabNo	= $('div.nuTabSelected[id^="nuTab"]').attr('data-nu-tab-filter')

  for (let i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
    const field 		= window.nuDragOptionsState.tabs[currentTabNo].objects[i]

    $('#nuDragOptionsFields option[id="drag_' + field.id + '"]', window.parent.document.body).attr('data-nu-tab-order', field.tab_order)
  }
}

function nuMoveUpOrder () {
  const currentTabNo 						= $('div.nuTabSelected[id^="nuTab"]', $('#nuDragDialog iframe').contents()).attr('data-nu-tab-filter')
  const currentSelectedFieldOption	 		= $('select#nuDragOptionsFields option:selected')

  for (let i = 0; i < $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
    const field 							= $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i]

    if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {
      // if it's at the top, dont re-order anything
      if (field.id == $('select#nuDragOptionsFields option')[0].id.replace('drag_', '')) { return }

      const previousFieldDOM 			= $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) - 10) + '"]')
      const previousFieldSTATE 			= nuFindFieldInState(currentTabNo, previousFieldDOM.prop('id').replace('drag_', ''))

      field.tab_order 				= Number(previousFieldDOM.attr('data-nu-tab-order'))
      previousFieldSTATE.tab_order 	= field.tab_order + 10

      $('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order)

      const previousFieldDOMID = previousFieldDOM.prop('id')
      previousFieldDOM.attr('data-nu-tab-order', previousFieldSTATE.tab_order)

      const previousFieldDOMHTML = $('option#' + previousFieldDOMID)[0].outerHTML

      $('option#' + previousFieldDOMID).remove()
      $('option#drag_' + field.id).after(previousFieldDOMHTML)
    }
  }
}

function nuMoveDownOrder () {
  const currentTabNo					= $('div.nuTabSelected[id^="nuTab"]', $('#nuDragDialog iframe').contents()).attr('data-nu-tab-filter')
  const currentSelectedFieldOption		= $('select#nuDragOptionsFields option:selected')

  for (let i = 0; i < $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
    const field						= $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[currentTabNo].objects[i]

    if (field.id == currentSelectedFieldOption.prop('id').replace('drag_', '')) {
      // if it's at the bottom, dont re-order anything
      if (field.id == $('select#nuDragOptionsFields option')[($('select#nuDragOptionsFields option').length - 1)].id.replace('drag_', '')) {
        return
      }

      const nextFieldDOM = $('select#nuDragOptionsFields option[data-nu-tab-order="' + (Number(currentSelectedFieldOption.attr('data-nu-tab-order')) + 10) + '"]')
      const nextFieldSTATE = nuFindFieldInState(currentTabNo, nextFieldDOM.prop('id').replace('drag_', ''))

      field.tab_order = Number(nextFieldDOM.attr('data-nu-tab-order'))
      nextFieldSTATE.tab_order = field.tab_order - 10

      $('option#drag_' + field.id).attr('data-nu-tab-order', field.tab_order)

      const nextFieldDOMID = nextFieldDOM.prop('id')

      nextFieldDOM.attr('data-nu-tab-order', nextFieldSTATE.tab_order)

      const nextFieldDOMHTML = $('option#' + nextFieldDOMID)[0].outerHTML

      $('option#' + nextFieldDOMID).remove()
      $('option#drag_' + field.id).before(nextFieldDOMHTML)
    }
  }
}

function nuFindFieldInState (tabNo, fieldID) {
  for (let i = 0; i < $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; i++) {
    if ($('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i].id == fieldID) {
      return $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[i]
    }
  }

  return null
}

function nuCreateDragOptionsBox (form) {
  const dragOptionsBoxWidth 		= 400
  var dragOptionsBoxMinHeight 	= 535
  var dragOptionsBoxMinHeight 	= 520
  const wh	= nuFormWH()
  const w	= wh.width
  const h	= wh.height

  const optionsBoxHTML = '<div id="nuDragOptionsBox" class="nuDragOptionsBox" style="width:' + (dragOptionsBoxWidth - 80) + 'px;height:100%;min-height:' + dragOptionsBoxMinHeight + 'px;">' +
		'<div class="nuDragOptionsBoxContainer">' +
			'<div id="dragOptionsTitle" class="nuDragOptionsBoxTitle">Options</div>' +
			'<label for="nuDragOptionsFields" class="nuDragOptionsFieldsLabel">Object Tab Order</label>' +
			'<select multiple id="nuDragOptionsFields" class="nuDragOptionsFields" onchange="nuUpdateDragSelections(this);"></select>' +
				'<table>' +
					'<tbody>' +
						'<tr>' +
							'<td><button id="move_up_btn" class="nuDragOptionsButton nuButton" onclick="nuMoveUpOrder();"><i class="nuDragOptionsIcon fa fa-arrow-up"></i> Up</button></td>' +
							'<td><button id="move_top_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignTop();"><i class="nuDragOptionsIcon270 fa fa-step-forward"></i> Top</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><button id="move_down_btn" class="nuDragOptionsButton nuButton" onclick="nuMoveDownOrder();"><i class="nuDragOptionsIcon fa fa-arrow-down"></i> Down</button></td>' +
							'<td><button id="move_bottom_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignBottom();"><i class="nuDragOptionsIcon90 fa fa-step-forward"></i> Bottom</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><button id="move_ver_btn" class="nuDragOptionsButton nuButton" onclick="nuSpaceVertically();"><i class="nuDragOptionsIcon fa fa-bars"></i> Vertical</button></td>' +
							'<td><button id="move_left_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignLeft();"><i class="nuDragOptionsIcon180 fa fa-step-forward"></i> Left</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><button id="move_hor_btn" class="nuDragOptionsButton nuButton" onclick="nuSpaceHorizontally();"><i class="nuDragOptionsIcon90 fa fa-bars"></i> Horizontal</button></td>' +
							'<td><button  id="move_right_btn" class="nuDragOptionsButton nuButton" onclick="nuAlignRight();"><i class="nuDragOptionsIcon fa fa-step-forward"></i> Right</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><button id="move_short_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToLowest();"><i class="nuDragOptionsIcon135 fa fa-compress"></i> Shortest</button></td>' +
							'<td><button  id="move_thin_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToThinnest();"><i class="nuDragOptionsIcon45 fa fa-compress"></i> Thinnest</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><button id="move_tall_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToHighest();"><i class="nuDragOptionsIcon135 fa fa-expand"></i> Tallest</button></td>' +
							'<td><button  id="move_wide_btn" class="nuDragOptionsButton nuButton" onclick="nuResizeToWidest();"><i class="nuDragOptionsIcon45 fa fa-expand"></i> Widest</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td><select id="nuDragOptionsTabsDropdown" class="nuDragOptionsButton" style="border: none"></select></td>' +
							'<td><button id="move_tab_btn" class="nuDragOptionsButton nuButton nuSaveButtonEdited" style="font-weight: bold;" onclick="nuMoveNuDrag();">Move to Tab</button></td>' +
						'</tr>' +
						'<tr>' +
							'<td>&nbsp;</td>' +
							'<td>&nbsp;</td>' +
						'</tr>' +
						'<tr>' +
							'<td></td>' +
							'<td><button id="save_btn" class="nuDragOptionsButton nuButton nuSaveButtonEdited" style="font-weight: bold;" onclick="nuSaveNuDrag();">Save</button></td>' +
						'</tr>' +
					'</tbody>' +
				'</table>' +
		'</div>' +
	'</div>'

  $('#nuWindow', window.parent.document.body).css('right', 15)

  $('#nuDragDialog', window.parent.document.body)
    .css('top', 35)
    .prepend(optionsBoxHTML)
    .css('height', Math.max(dragOptionsBoxMinHeight + 10, window.innerHeight + 40))
    .css('width', w + dragOptionsBoxWidth - 15)

  $('#nuBreadcrumbHolder').remove()
  $('#nuRECORD').css('height', window.innerHeight)

  nuInitialiseDragState()
  nuPopulateFieldsList(0)
  nuPopulateTabDropdown(0)

  $('.nuTab[id^="nuTab"]').prop('onclick', '')
  $('.nuTab[id^="nuTab"]').click(function () {
    if ($(this).hasClass('nuTabSelected')) {
      return
    }

    nuClearFieldsList()
    nuUnselectAllDragObjects()
    nuSelectTab(this)

    nuPopulateFieldsList(Number($(this).attr('data-nu-tab-filter')))
    nuPopulateTabDropdown(Number($(this).attr('data-nu-tab-filter')))
    nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields', window.parent.document.body))
    nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields', window.parent.document.body))
  })

  nuCheckIfMovingTabOrderAllowed($('#nuDragOptionsFields'))
  nuCheckIfMovingFieldToOtherTabAllowed($('#nuDragOptionsFields'))

  let help	= "<input id='run_sam' type='button' class='input_button nuButton' value='?' "
  help		+= "onclick='nuMessage(["

  help		+= '"Use arrow keys to move selected Objects.", '
  help		+= '"Use arrow keys + SHIFT to resize selected Objects.", '
  help		+= '"Draw a square around Objects to highlight them.", '
  help		+= '"Hold CTRL to add Objects to the current selection.", '

  help		+= "])' "
  help		+= "style='top: 2px; right: 10px; width: 21px; height: 21px; text-align: center; position: absolute;'>"

  $('body').append(help)

  $('.nuRECORD').css('width', '99.3%')
}

function nuResizeToLowest () {
  let lowest 		= 1000000

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).height() < lowest) {
      lowest 	= $(this).height()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('height', lowest + 'px')
  })
}

function nuResizeToThinnest () {
  let thinnest		= 1000000

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).width() < thinnest) {
      thinnest 	= $(this).width()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('width', thinnest + 'px')
  })
}

function nuResizeToHighest () {
  let highest 		= 0

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).height() > highest) {
      highest 	= $(this).height()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('height', highest + 'px')
  })
}

function nuResizeToWidest () {
  let widest 		= 0

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).width() > widest) {
      widest 	= $(this).width()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('width', widest + 'px')
  })
}

function nuSortObjAsc (a, b) {
  return a.top - b.top
}

function nuSpaceHorizontally () {
  const selectedFields		= []

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    selectedFields.push({
      left: $(this).position().left,
      width: $(this).width(),
      id: $(this).prop('id')
    })
  })

  selectedFields.sort(nuSortObjAsc)

  let gapTotal 			= 0
  let leftTotal			= 0

  for (var i = 1; i < selectedFields.length; i++) {
    gapTotal 			+= selectedFields[i].left - (selectedFields[i - 1].left + selectedFields[i - 1].width)
    leftTotal			+= selectedFields[i].left - selectedFields[i - 1].left
  }

  const gapAvg 				= Math.round(gapTotal / (selectedFields.length - 1))
  const leftAvg 			= Math.round(leftTotal / (selectedFields.length - 1))

  if (gapAvg < 0) {
    for (var i = 1; i < selectedFields.length; i++) {
      $('#' + selectedFields[i].id, $('#nuDragDialog iframe').contents()).css('left', ($('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).position().left + leftAvg) + 'px')
    }
  } else {
    for (var i = 1; i < selectedFields.length; i++) {
      $('#' + selectedFields[i].id, $('#nuDragDialog iframe').contents()).css('left', ($('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).position().left + $('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).width() + gapAvg) + 'px')
    }
  }
}

function nuSpaceVertically () {
  const selectedFields 	= []

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    selectedFields.push({

      top: $(this).position().top,
      height: $(this).height(),
      id: $(this).prop('id')

    })
  })

  selectedFields.sort(nuSortObjAsc)

  let gapTotal	= 0
  let topTotal	= 0

  for (var i = 1; i < selectedFields.length; i++) {
    gapTotal	+= selectedFields[i].top - (selectedFields[i - 1].top + selectedFields[i - 1].height)
    topTotal	+= selectedFields[i].top - selectedFields[i - 1].top
  }

  const gapAvg		= Math.round(gapTotal / (selectedFields.length - 1))
  const topAvg		= Math.round(topTotal / (selectedFields.length - 1))

  if (gapAvg < 0) {
    for (var i = 1; i < selectedFields.length; i++) {
      $('#' + selectedFields[i].id, $('#nuDragDialog iframe').contents()).css('top', ($('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).position().top + topAvg) + 'px')
    }
  } else {
    for (var i = 1; i < selectedFields.length; i++) {
      $('#' + selectedFields[i].id, $('#nuDragDialog iframe').contents()).css('top', ($('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).position().top + $('#' + selectedFields[i - 1].id, $('#nuDragDialog iframe').contents()).height() + gapAvg) + 'px')
    }
  }
}

function nuAlignRight () {
  let rightestFieldID		= ''
  let rightestPoint		= 0

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).position().left + $(this).width() > rightestPoint) {
      rightestFieldID = $(this).prop('id')
      rightestPoint	= $(this).position().left + $(this).width()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('left', (rightestPoint - $(this).width()) + 'px')
  })
}

function nuAlignLeft () {
  let leftestFieldID		= ''
  let leftestPoint		= 1000000

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).position().left < leftestPoint) {
      leftestFieldID 	= $(this).prop('id')
      leftestPoint 	= $(this).position().left
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('left', leftestPoint + 'px')
  })
}

function nuAlignTop () {
  let highestFieldID 		= ''
  let highestPoint 		= 1000000

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).position().top < highestPoint) {
      highestFieldID 	= $(this).prop('id')
      highestPoint 	= $(this).position().top
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('top', highestPoint + 'px')
  })
}

function nuAlignBottom () {
  let lowestFieldID		= ''
  // its 0 here because technically top: 0px is the highest...
  let lowestPoint			= 0

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    if ($(this).position().top + $(this).height() > lowestPoint) {
      lowestFieldID	= $(this).prop('id')
      lowestPoint		= $(this).position().top + $(this).height()
    }
  })

  $('div.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).css('top', (lowestPoint - $(this).height()) + 'px')
  })
}

function nuMoveNuDrag () {
  // find tab we are moving objects to
  var moveToTab 				= $('#nuDragOptionsTabsDropdown').val().substring($('#nuDragOptionsTabsDropdown').val().length - 1)
  var moveToTab 				= $('#nuDragOptionsTabsDropdown').val().substring(5)

  $('#nuDragOptionsFields :selected').each(function (i, selected) {
    const fieldToMove 		= $(selected).text()
    const initialTab 			= $('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab')

    // hide objects on screen so they can be redrawn on correct tab.
    $('#nuWindow').contents().find('#' + fieldToMove).attr('data-nu-tab', moveToTab).hide()

    // get tab objects array
    var tabObjects 			= $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[initialTab]
    const index 				= 0
    let foundField 			= false

    for (var i = 0; i < tabObjects.objects.length; i++) {
      if (tabObjects.objects[i].id == fieldToMove) {
        const fieldObject = $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i]

        foundField = true

        $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[moveToTab].objects.push(fieldObject)
        $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects.splice(i, 1)

        i--
      } else if (foundField) {
        $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[initialTab].objects[i].tab_order -= 10
      }
    }

    // update orders
    var tabObjects 			= $('#nuWindow')[0].contentWindow.nuDragOptionsState.tabs[moveToTab]

    for (let j = 0; j < tabObjects.objects.length; j++) {
      tabObjects.objects[j].tab_order = Number(j * 10) + Number(moveToTab * 100)
    }
  })

  // go to new tab
  $('#nuWindow').contents().find('#nuTab' + moveToTab).click()
}

function nuSaveNuDrag () {
  $('body').append('<div id="overlay" style="background-color:grey;position:absolute;top:0;left:0;height:100%;width:100%;z-index:999;"></div>')

  if (!nuPutFieldDimensionsIntoState()) {
    return
  }

  if (parent.nuFORM !== undefined) {
    parent.nuFORM.edited = false
  }

  nuSaveAfterDrag()
}

function nuAbortSaveDrag () {
	 $('#overlay').remove()
}

function nuPutFieldDimensionsIntoState () {
  for (let tabNo = 0; tabNo < $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs.length; tabNo++) {
    for (let fieldNo = 0; fieldNo < $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects.length; fieldNo++) {
      const field = $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState.tabs[tabNo].objects[fieldNo]

      if ($('div#' + field.id, $('#nuDragDialog iframe').contents()).length == 1) {
        $('div#' + field.id, $('#nuDragDialog iframe').contents()).show()

        field.left		= $('div#' + field.id, $('#nuDragDialog iframe').contents()).position().left
        field.top		= $('div#' + field.id, $('#nuDragDialog iframe').contents()).position().top
        field.width		= $('div#' + field.id, $('#nuDragDialog iframe').contents()).width()
        field.height	= $('div#' + field.id, $('#nuDragDialog iframe').contents()).height()

        $('div#' + field.id, $('#nuDragDialog iframe').contents()).hide()
      } else {
        alert('Error putting field dimensions into state with id: ' + field.id)

        return false
      }
    }
  }

  return true
}

function nuUpdateDragSelections (fieldsSelectBox) {
  nuUnselectAllDragObjects()
  nuCheckIfMovingTabOrderAllowed(fieldsSelectBox)
  nuCheckIfMovingFieldToOtherTabAllowed(fieldsSelectBox)

  $('option:selected', fieldsSelectBox).each(function () {
    $('#' + $(this).prop('id').replace('drag_', ''), $('#nuDragDialog iframe').contents()).addClass('nuDragSelected')
  })
}

function nuCheckIfMovingTabOrderAllowed (fieldsSelectBox) {
  if ($('option:selected', fieldsSelectBox).length == 1) {
    $('#move_down_btn, #move_up_btn').removeAttr('disabled')
    $('#move_down_btn, #move_up_btn').removeClass('nuDragOptionsButtonDisabled')
    $('#move_down_btn, #move_up_btn', window.parent.document.body).removeAttr('disabled')
    $('#move_down_btn, #move_up_btn', window.parent.document.body).removeClass('nuDragOptionsButtonDisabled')
  } else {
    $('#move_down_btn, #move_up_btn').prop('disabled', 'disabled')
    $('#move_down_btn, #move_up_btn').addClass('nuDragOptionsButtonDisabled')
    $('#move_down_btn, #move_up_btn', window.parent.document.body).prop('disabled', 'disabled')
    $('#move_down_btn, #move_up_btn', window.parent.document.body).addClass('nuDragOptionsButtonDisabled')
  }
}

function nuCheckIfMovingFieldToOtherTabAllowed (fieldsSelectBox) {
  const currentTabNo 		= $('div.nuTabSelected[id^="nuTab"]').attr('data-nu-tab-filter')
  const tabDropdown 		= $('#nuDragOptionsTabsDropdown', window.parent.document.body)

  if ($('option:selected', fieldsSelectBox).length >= 1) {
    tabDropdown.removeAttr('disabled')
  } else {
    tabDropdown.prop('disabled', 'disabled')
  }
}

function nuUnselectAllDragObjects () {
  $('.nuDragSelected').each(function () {
    $(this).removeClass('nuDragSelected')
  })

  $('.nuDragSelected', $('#nuDragDialog iframe').contents()).each(function () {
    $(this).removeClass('nuDragSelected')
  })
}

function nuClearFieldsList () {
  $('#nuDragOptionsFields', window.parent.document.body).html('')
  $('#nuDragOptionsTabsDropdown', window.parent.document.body).html('')
}

function nuPopulateFieldsList (currentlySelectedTabNo) {
  let tabOrderSearch 	= nuGetMinTabOrderInTab(currentlySelectedTabNo)
  let field 			= null

  for (let i = 0; i < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; i++) {
    for (let j = 0; j < window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects.length; j++) {
      field 		= window.nuDragOptionsState.tabs[currentlySelectedTabNo].objects[j]

      if (field.tab_order == tabOrderSearch) {
        $('#nuDragOptionsFields', window.parent.document.body).append('<option id="drag_' + field.id + '">' + field.id + '</option>')
      }
    }

    tabOrderSearch 	= tabOrderSearch + 10
  }

  nuSetTabOrderDataAttrs()
}

function nuGetMinTabOrderInTab (currentTabNo) {
  let minTabOrder			= 1000000

  for (let i = 0; i < window.nuDragOptionsState.tabs[currentTabNo].objects.length; i++) {
    if (window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order < minTabOrder) { minTabOrder		= window.nuDragOptionsState.tabs[currentTabNo].objects[i].tab_order }
  }

  if (minTabOrder == 1000000) {
    return null
  }

  return minTabOrder
}

function nuMoveSelected () {
  const s		= document.getElementsByClassName('nuDragSelected')
  let l		= 0
  let t		= 0
  let o		= {}

  for (let i = 0; i < s.length; i++) {
    o		= s[i].style
    l		= parseInt(o.left) + (window.moveX - window.lastMoveX)
    t		= parseInt(o.top) + (window.moveY - window.lastMoveY)
    o.left	= l + 'px'
    o.top	= t + 'px'
  }
}

function nuCanMove () {
  const s 		= document.getElementsByClassName('nuDragSelected')
  let l 		= 0
  let t 		= 0
  let o 		= {}

  for (let i = 0; i < s.length; i++) {
    o		= s[i].style
    l		= parseInt(o.left) + (window.moveX - window.lastMoveX)
    r		= l + parseInt(o.width)
    t		= parseInt(o.top) + (window.moveY - window.lastMoveY)
    b		= t + parseInt(o.height)

    if (l < 0) {
      return false
    }

    if (t < 0) {
      return false
    }
  }

  return true
}

function nuGetTopArea () {
  const nuActionHolder		= parseInt($('#nuActionHolder').css('height'))
  const nuTabHolder			= parseInt($('#nuTabHolder').css('height'))
  const p 					= parent.window.$
  const dialogTitle			= parseInt(p('#dialogTitle').css('height'))

  if ($('#nuBreadcrumbHolder').length == 1) {
    var nuBreadcrumbHolder	= parseInt($('#nuBreadcrumbHolder').css('height'))
  } else {
    var nuBreadcrumbHolder	= 0
  }

  return nuActionHolder + nuBreadcrumbHolder + nuTabHolder + dialogTitle
}

function nuPopulateTabDropdown (currentlySelectedTabNo) {
  // Create a dropdown with the values of the tabs
  $('div.nuTab[id^="nuTab"]').each(function () {
    const tabNumber		= $(this).attr('data-nu-tab-filter')
    const tabName			= $(this).text()

    if (tabNumber != currentlySelectedTabNo) {
      $('#nuDragOptionsTabsDropdown', window.parent.document.body).append('<option value="nuTab' + tabNumber + '">' + tabName + '</option>')
    }
  })

  // Select the current tab
  $('#nuDragOptionsTabsDropdown').find('option:first').prop('selected', 'selected')
}
