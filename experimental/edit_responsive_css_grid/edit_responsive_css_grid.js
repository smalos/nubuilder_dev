function nuWrapInClass (element, element2, classes, containerclass) {
  if (element2) {
    $(element).add(element2).wrapAll('<div class="' + classes + '"></div>')
  } else {
    $(element).wrap('<div  class="' + classes + '"></div>')
  }

  if (containerclass) {
    const $wrapper = $('<div class="' + containerclass + '"></div>')
    $('.' + classes).wrapAll($wrapper)
  }
}

function nuMoveObjectsToGroup (sourceContainerId, targetGroupBoxId, objectIds) {
  // Get the source container element
  const sourceContainer = document.getElementById(sourceContainerId)

  // Get the target group box element
  const targetGroupBox = document.getElementById(targetGroupBoxId)

  // Check if the elements exist
  if (sourceContainer && targetGroupBox) {
    // Convert the objectIds to an array if it's not already
    if (!Array.isArray(objectIds)) {
      objectIds = [objectIds]
    }

    // Move the objects to the target group box
    for (let i = 0; i < objectIds.length; i++) {
      const objectId = objectIds[i]
      const objects = document.querySelectorAll('#' + objectId + ', .' + objectId)

      if (objects.length > 0) {
        objects.forEach(function (object) {
          targetGroupBox.appendChild(object)
        })
      } else {
        console.log('Object with ID or class "' + objectId + '" not found')
      }
    }
  } else {
    console.log('One or both"' + sourceContainer + '" or"' + targetGroupBox + '" elements not found')
  }
}
// use case of above function
// //// Move objects with ID "myObject" and class "myClass" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", ["myObject", "myClass"]);

// // Move objects with ID "object1" and class "object2" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", ["object1", "object2"]);

// // Move objects with ID "object3" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", "object3");

// // Move objects with class "myClass" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", "myClass");

function nuSetGridProperties (targetId, parentId) {
  const targetInput = document.getElementById(targetId)
  const parentDiv = document.getElementById(parentId)
  const gridrow = 'grid-row'
  if (targetInput && parentDiv) {
    parentDiv.style.gridRow = targetInput.style.gridRow
    parentDiv.style.gridColumn = targetInput.style.gridColumn
    parentDiv.style.gap = targetInput.style.gap
  }
}

function observeGridChanges (targetId, parentId) {
  const targetInput = document.getElementById(targetId)

  if (!targetInput) return

  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.attributeName === 'style') {
        nuSetGridProperties(targetId, parentId)
      }
    })
  })

  observer.observe(targetInput, {
    attributes: true
  })
}

function addToggle () {
  $('.nuContentBoxTitle').each(function () {
    if (!$(this).text().trim()) {
      $(this).removeClass('nuContentBoxTitle').addClass('nuContentBoxTitle-noText')
    }
  })

  $('.nuContentBoxTitle').click(function () {
    $(this).toggleClass('open')
    $(this).next('.nuContentBoxContainer').find('.nuContentBox,.nuObjectWrapper').toggle('slow')
  })
}

function nuAddTabContentContainer () {
  const $tabs = $('[data-nu-tab]:not([data-nu-form!=""],[data-nu-subform="true"])') // Get all elements with data-nu-tab attribute :not([data-nu-form!=""]
  const tabContainers = {} // Create an object to keep track of the tab container elements

  $tabs.each(function (index) {
    const tabIndex = $(this).data('nu-tab') // Get the value of the data-nu-tab attribute
    // var $tabContent = $('[data-nu-tab="' + tabIndex + '"]'); // Get all elements with the matching data-nu-tab attribute
    const $tabContent = $('[data-nu-tab="' + tabIndex + '"]:not([data-nu-form!=""])') // :not([data-nu-form!=""]) ,[data-nu-form-id]

    if (!tabContainers[tabIndex]) {
      const $tabContainer = $('<div>').addClass('nuTab-container').attr('data-tab-index', tabIndex)
      const $gridContainer = $('<div>').addClass('nuGrid-container').attr('id', 'nuGrid-Container' + tabIndex)

      $tabContainer.append($gridContainer)
      tabContainers[tabIndex] = $tabContainer
    }

    tabContainers[tabIndex].find('.nuGrid-container').append($tabContent)
  })

  $.each(tabContainers,
    function (index, container) {
      $('#nuRECORD').append(container) // Append each tab container element to the #nuRECORD element
    })
}

function nuOnLoad () {
  if (nuFormType() == 'edit') {
    $(document).ready(function () {
      function isResponsive () {
        const f = window.nuFORM.getProperty('form_id')
        return f.containsAny(['nuaccess', 'nuhomecompact', 'nuuser', '5d0053b54f1df1a', '60ff227479f9950'])
      }

      function nuHideInactiveTabContents () {
        $(function () {
          // Add click event listener to the tab menu
          $('.nuTab').on('click', function () {
            // Get the index of the clicked tab
            const tabIndex = $(this).index()

            // Remove the active class from all tabs
            $('.nuTab').removeClass('active')
            // Add the active class to the clicked tab
            $(this).addClass('active')

            // Hide all content
            $('.nuTab-container').hide().removeClass('active')
            // Show the content corresponding to the clicked tab
            $('.nuTab-container[data-tab-index="' + tabIndex + '"]').show().addClass('active')
          })

          // Set the active .tab-container to display as grid
          $('.nuTab-container.active').css('display', 'grid !important')
        })
      }

      if (isResponsive()) {
        nuAddTabContentContainer()

        const frmid = window.nuFORM.getProperty('form_id')

        const o = nuSERVERRESPONSE.objects
        for (let i = 0; i < o.length; i++) {
          const id = o[i].id
          const oType = o[i].type
          const index = i

          $('#' + id + ',#label_' + id + ',#' + id + '_file, .select2, span, .selection,.nuContentBox ').css({
            top: '', left: '', width: '', position: '', height: ''
          })
          $('#' + id + 'code,#' + id + 'button,#' + id + 'description').css({
            top: '', left: '', width: '', position: '', height: ''
          })
          $('#label_' + id).insertBefore($('#label_' + id).prev())

          if (oType == 'lookup') {
            $('#' + id + ',#label_' + id + ',#' + id + 'code, #' + id + 'button,#' + id + 'description').wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper  nuLookupWrapper "></div>')
            $('#' + id + 'code, #' + id + 'button,#' + id + 'description , #sal_zzzzsys_form_id_open_button').wrapAll('<div class="nuLuWrapper"></div>') //, #sal_zzzzsys_form_id_open_button
          }

          if (o[i].input === 'checkbox') {
            $('#label_' + id + ',#' + id).wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper  nuResCheckbox "></div>') // 02/02/23 Added Class:nuRespButton .not('#sal_zzzzsys_form_id_open_button')
          }

          if (oType == 'file') {
            $('#label_' + id + ',#' + id + ',#' + id + '_file').wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper nuFileWrapper  "></div>')
          }
          if (o[i].select2 == '1') {
            $('#label_' + id + ',#' + id + ', .select2').wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper "></div>')
          }
          if (o[i].input == 'button' || o[i].type == 'button') {
            $('#' + id + '').not('#sal_zzzzsys_form_id_open_button').wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper nuRespButton  "></div>') // 02/02/23 Added Class:nuRespButton .not('#sal_zzzzsys_form_id_open_button')
          }
          if (oType == 'contentbox') {

            // $("#label_"+id).insertBefore($("#label_"+id).prev());

            // $("#label_"+id+",#"+id).hide();
          }

          if (oType == 'subform') {
            // subforms in tab one only-responsive + scroll on small screens o[i].tab === 0 &&

            $('#label_' + id + ',#' + id).wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper nuSubformWrapper "></div>')
            $('#' + id + ',#label_' + id).css({
              top: '', left: '', position: '', width: '', height: ''

            })
            $('#' + id).css({
              overflow: 'auto'
            })
          }

          if (o[i].read !== '2' && o[i].type !== 'subform' && o[i].type !== 'contentbox' && oType !== 'lookup' && o[i].input !== 'checkbox' && oType !== 'contentbox' && o[i].input !== 'button' && o[i].type !== 'button') {
            $('#' + id + ',#label_' + id).wrapAll('<div id="' + id + '_cid" class="nuObjectWrapper "/></div>')
          }

          nuSetGridProperties(id, id + '_cid')
        }

        $('#user_home,#run_user,edit_php, #menu_procedures, #user_add,#run_access,#run_setup, #menu_setup, #access_add,#form_button, #menu_forms,#object_button,#objects_add,#open_database, #menu_database,#run_filemanager,#run_sql, #sql_add,#run_file, #sql_file,#run_note, #notes_add,#edit_report, #menu_reports,#run_nucodesnippets, #nucodesnippets_add').unwrap()

        nuWrapInClass('#user_home', '', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_user', '#user_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_access', '#access_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#form_button', '#menu_forms', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#object_button', '#objects_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#open_database', '#menu_database', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_setup', '#menu_setup', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_filemanager', '', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_sql', '#sql_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_file', '#sql_file', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_note', '#notes_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#edit_report', '#menu_reports', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_nucodesnippets', '#nucodesnippets_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#edit_php', '#menu_procedures', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuWrapInClass('#run_nuemailtempltates', '#run_nuemailtempltates_add', 'nuHomeRespButton', 'nuHomeButtonWrapper')
        nuMoveObjectsToGroup('nuGrid-Container0', 'contentbox', 'nuHomeButtonWrapper')

        if (frmid == 'nuuser') {
          $('.nuRespButton ').unwrap('.nuObjectWrapper')
          $('#sus_zzzzsys_access_id_open_button').appendTo('.nuLuWrapper')

          const sourceContainerId = 'nuGrid-Container0'
          const targetGroupBoxId = 'contentbox_login'
          const objectIds = ['sus_name_cid',
            'sus_zzzzsys_access_id_cid',
            'sus_login_name_cid',
            'new_password_cid',
            'check_password_cid',
            'sus_language_cid',
            'sus_password_show_btn_cid']
          const objectIds2 = ['sus_email_cid',
            'sus_code_cid',
            'sus_team_cid',
            'sus_department_cid',
            'sus_position_cid',
            'sus_additional1_cid',
            'sus_additional2_cid',
            'sus_expires_on_cid']

          // Call the function to move the objects
          nuMoveObjectsToGroup(sourceContainerId, targetGroupBoxId, objectIds)
          nuMoveObjectsToGroup(sourceContainerId, 'contentbox_additional', objectIds2)
        }

        if (frmid == 'nuaccess') {
          $('.nuRespButton').unwrap('.nuObjectWrapper')
          $('#sal_zzzzsys_form_id_open_button').appendTo('.nuLuWrapper')
          const objectIds3 = ['sal_zzzzsys_form_id_cid',
            'sal_code_cid',
            'sal_description_cid',
            'sal_group_cid',
            'sal_use_2fa_cid'
          ]

          nuMoveObjectsToGroup('nuGrid-Container0', 'contentbox_user', objectIds3)
        }

        nuHideInactiveTabContents()
        // addToggle();
        $('div:empty').remove()
      }

      // }
    })
  }
}
