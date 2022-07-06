
function nuAjax (w, successCallback, errorCallback) {
  w = nuAddEditFieldsToHash(w)
  w = JSON.stringify(w)

  $.ajax({

    async: true,
    dataType: 'json',
    url: 'core/nuapi.php',
    method: 'POST',
    data: { nuSTATE: w },
    success: function (data, textStatus, jqXHR) {
      successCallback(data, textStatus, jqXHR)
    },
    error: function (jqXHR, textStatus, errorThrown) {
      window.test = jqXHR.responseText

      if (errorCallback !== undefined) {
        errorCallback(jqXHR, textStatus, errorThrown)
      };

      const err = nuFormatAjaxErrorMessage(jqXHR, errorThrown)

      let msgDiv

      if (parent.$('#nuModal').length > 0 && parent.$('#nuModal').siblings('.nuDragDialog').css('visibility') == 'hidden') {
        msgDiv = parent.nuMessage(err)
        nuClosePopup()
        return
      }

      msgDiv = nuMessage(err)

      if (window.nuOnMessage) {
        nuOnMessage(msgDiv, err)
      }
    },

    complete: function (jqXHR, textStatus) {
      // --
    }

  })
}

function nuForm (f, r, filter, search, n, like) {
  if (n == 2) {
    window.nuNEW = 1
    search = ''
  }

  if (like == undefined) {
    like = ''
  } else {
    like = nuDecode(like)
  }

  if (nuOpenNewBrowserTab('getform', f, r, filter)) { return }

  if (n != 1) {	// -- add a new breadcrumb
    window.nuFORM.addBreadcrumb()
  }

  const current = window.nuFORM.getCurrent()
  current.search = search

  if (current.filter == '') {
    if (filter != '') {
      current.filter = filter
    } else {
      if (window.nuFILTER != '') {
        current.filter = window.nuFILTER
      }
    }
  }

  const last = $.extend(true, {}, current)

  last.call_type = 'getform'
  last.form_id = f
  last.record_id = r
  last.filter = filter == '' ? window.nuFILTER : filter
  last.search = search

  if (parent.nuHashFromEditForm === undefined) {
    last.hash = []
  } else {
    last.hash = parent.nuHashFromEditForm()
  }

  last.AAA = 'hw'
  last.like = like

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (nuDisplayError(fm)) {
      nuCursor('default')

      parent.$('#nuModal').remove()

      if (parent.$('#nuDragDialog').css('visibility') == 'hidden') {
        parent.nuDisplayError(fm)
        parent.$('#nuDragDialog').remove()
      }

      nuFORM.breadcrumbs.pop()

      if (fm.log_again == 1) { location.reload() }
    } else {
      const last = window.nuFORM.getCurrent()
      last.record_id = fm.record_id
      last.FORM = fm.form

      nuBuildForm(fm)
    }
  }

  nuAjax(last, successCallback)
}

function nuGetReport (f, r) {
  if (nuOpenNewBrowserTab('getreport', f, r, '')) { return }

  const last = window.nuFORM.addBreadcrumb()

  last.session_id = window.nuSESSION
  last.call_type = 'getreport'
  last.form_id = f
  last.record_id = r

  if (parent.nuHashFromEditForm === undefined) {
    last.hash = []
  } else {
    last.hash = parent.nuHashFromEditForm()
  }

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      nuBuildForm(fm)
    }
  }

  nuAjax(last, successCallback)
}

function nuRunReport (f, iframe) {
  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = window.nuSESSION
  last.call_type = 'runreport'
  last.form_id = f
  last.hash = parent.nuHashFromEditForm()

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      const pdfUrl = 'core/nurunpdf.php?i=' + fm.id

      if (iframe === undefined) {
        window.open(pdfUrl)
      } else {
        parent.$('#' + iframe).attr('src', pdfUrl)
      }
    }
  }

  nuAjax(last, successCallback)
}

function nuRunReportSave (f, tag = null, callback = null) {
  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)
  last.session_id = window.nuSESSION
  last.call_type = 'runreport'
  last.form_id = f
  last.hash = nuHashFromEditForm()
  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      const fd = new FormData()
      fd.append('ID', fm.id)
      fd.append('tag', tag)
      const xhr = new XMLHttpRequest()

      if (callback !== null) {
        xhr.onreadystatechange = function () {
          if (this.readyState == 4 && this.status == 200) {
            const data = JSON.parse(xhr.responseText)
            callback(data.filename, data.id, this)
          }
        }
      }

      xhr.open('POST', 'core/nurunpdf.php', true)
      xhr.send(fd)
    }
  }

  nuAjax(last, successCallback)
}

function nuAskLogout () {
  if (nuFormsUnsaved() > 0) {
    if (!confirm(nuTranslate('There are unsaved changes. Do you really want to leave the page?'))) return
  }

  nuLogout()
}

function nuLogout (f, iframe) {
  nuFORM.addBreadcrumb()

  const last = nuFORM.getCurrent()

  last.session_id = window.nuSESSION
  last.call_type = 'logout'

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      sessionStorage.removeItem('nukeepalive')
      window.open('index.php', '_self')
    }
  }

  nuAjax(last, successCallback)
}

function nuGetPHP (f, r) {
  if (nuOpenNewBrowserTab('getphp', f, r, '')) { return }

  window.nuFORM.addBreadcrumb()

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = window.nuSESSION
  last.call_type = 'getphp'
  last.form_id = f
  last.record_id = r

  if (parent.nuHashFromEditForm === undefined) {
    last.hash = []
  } else {
    last.hash = parent.nuHashFromEditForm()
  }

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      nuFORM.setProperty('record_id', fm.record_id)
      nuBuildForm(fm)
    } else {
      window.nuFORM.breadcrumbs.pop()
    }
  }

  nuAjax(last, successCallback)
}

function nuRunPHP (pCode, iframe, rbs) {
  if (arguments.length < 3) {
    if (window.nuBeforeSave) {
      if (nuBeforeSave() === false) { return }
    }
  }

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = nuSESSION
  last.call_type = 'runphp'
  last.form_id = pCode
  last.nuFORMdata = nuFORM.data()

  if (nuFORM.getCurrent() === undefined) {
    last.record_id = parent.nuFORM.getCurrent().record_id

    if (parent.nuHashFromEditForm === undefined) {
      last.hash = []
    } else {
      last.hash = parent.nuHashFromEditForm()
    }
  } else {
    last.record_id = nuFORM.getCurrent().record_id
    last.hash = nuHashFromEditForm()
  }

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      const pdfUrl = 'core/nurunphp.php?i=' + fm.id

      if (iframe === undefined || iframe === '') {
        window.open(pdfUrl)
      } else {
        parent.$('#' + iframe).attr('src', pdfUrl)
      }
    }
  }

  nuAjax(last, successCallback)
}

function nuRunPHPHidden (i, rbs) {
  if (arguments.length == 1) {
    if (window.nuBeforeSave) {
      if (nuBeforeSave() === false) { return }
    }
  }

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = window.nuSESSION
  last.call_type = 'runhiddenphp'
  last.form_id = 'doesntmatter'
  last.hash_record_id = last.record_id
  last.record_id = i					// -- php code
  last.nuFORMdata = nuFORM.data()
  last.hash = nuHashFromEditForm()

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (nuDisplayError(fm)) { return };

    window.nuSERVERRESPONSE_HIDDEN = fm
    eval(fm.callback + ';')
  }

  nuAjax(last, successCallback)
}

function nuRunPHPHiddenWithParams (i, paramName, paramValue, rbs) {
  nuSetProperty(paramName, nuBase64encode(JSON.stringify(paramValue)))
  nuRunPHPHidden(i, rbs)
}

function nuSystemUpdate () {
  const msg = nuTranslate('Update system? Be sure to backup first.')
  if (confirm(msg) == false) { return }

  if (nuCurrentProperties().form_code == 'nuupdate') {
    const myWindow = window.open('', '_self')
    myWindow.document.write(nuTranslate('This tab can be closed after the update.') + ' <br> ' + nuTranslate('You will need to log in again for the changes to take effect.'))
  }

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = nuSESSION
  last.call_type = 'systemupdate'
  last.form_id = 'systemupdate'
  last.nuFORMdata = nuFORM.data()
  last.hash = nuHashFromEditForm()

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      const updateUrl = 'core/nusystemupdate.php?i=' + fm.id
      window.open(updateUrl)
    }
  }

  nuAjax(last, successCallback)
}

function nuAttachImage (i, code, fit) {
  code = String(code).toLowerCase()
  const imgID = 'image_' + i
  const w = $('#' + i).css('width')
  const h = $('#' + i).css('height')

  const size = fit === false ? '' : ' width="' + w + '" height="' + h
  $('#' + i).html('<img id="' + imgID + '" class="nuBrowseImage"' + size + '" src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs%3D">')

  if (window.nuGraphics.indexOf(code + '.png') != -1) {						// -- check filenames in graphics dir.
    $('#' + imgID).attr('src', 'core/graphics/' + code + '.png')

    return
  }

  const PARENT = parent.parent.parent.parent.parent.parent.parent.parent.parent

  if (PARENT.nuImages[code] !== undefined) {
    const p = JSON.parse(PARENT.nuImages[code])
    const b = atob(p.file)

    $('#' + imgID).attr('src', b)

    return
  }

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = window.nuSESSION
  last.call_type = 'getfile'
  last.fileCode = code

  const successCallback = function (data, textStatus, jqXHR) {
    if (nuDisplayError(data)) { return };

    if (data.JSONfile !== null) {
      PARENT.nuImages[code] = data.JSONfile
      const p = JSON.parse(PARENT.nuImages[code])
      const b = atob(p.file)

      $('#' + imgID).attr('src', b)
    }
  }

  nuAjax(last, successCallback)
}

function nuAttachButtonImage (i, c, cssClass) {
  var cssClass = cssClass === undefined ? 'nuButtonImage' : cssClass

  c = String(c).toLowerCase()

  if (window.nuGraphics.indexOf(c + '.png') != -1) {						// -- check filenames in graphics dir.
    $('#' + i)
      .css({ 'background-image': 'url("core/graphics/' + c + '.png', 'background-position': '3px 0' })
      .addClass(cssClass)

    return
  }

  const PARENT = parent.parent.parent.parent.parent.parent.parent.parent.parent

  const pi = PARENT.nuImages !== undefined ? PARENT.nuImages[c] : ''

  if (pi !== undefined && pi !== '') {
    const p = JSON.parse(pi)
    const b = atob(p.file)

    $('#' + i)
      .css('background-image', 'url("' + b + '")')
      .addClass(cssClass)

    return
  }

  const current = nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  last.session_id = window.nuSESSION
  last.call_type = 'getfile'
  last.fileCode = c

  const successCallback = function (data, textStatus, jqXHR) {
    if (nuDisplayError(data)) { return };

    if (data.JSONfile !== null) {
      PARENT.nuImages[c] = data.JSONfile
      const p = JSON.parse(pi)
      const b = atob(p.file)

      $('#' + i)
        .css('background-image', 'url("' + b + '")')
        .addClass(cssClass)
    }
  }

  nuAjax(last, successCallback)
}

function nuGetLookupId (pk, id, setFocus) {
  $('#nuLookupList').remove()

  const l = $('#' + id)

  const last = nuFORM.getCurrent()

  last.session_id = nuSESSION
  last.call_type = 'getlookupid'
  last.object_id = l.attr('data-nu-object-id')
  last.target = l.attr('data-nu-target')
  last.prefix = l.attr('data-nu-prefix')
  last.primary_key = pk

  const successCallback = function (data, textStatus, jqXHR) {
    nuSERVERRESPONSELU = data

    nuCursor('default')

    if (!nuDisplayError(data)) {
      nuPopulateLookup(data, id, setFocus)
      $('#' + id).addClass('nuEdited')
      nuHasBeenEdited()

      const o = $('#' + id)

      if (o.attr('data-nu-prefix') == '') { return }

      nuAddSubformRow(o[0], false)
    }
  }

  nuAjax(last, successCallback)
}

function nuGetLookupCode (e) {
  const last = window.nuFORM.getCurrent()

  last.session_id = window.nuSESSION
  last.call_type = 'getlookupcode'
  last.object_id = e.target.getAttribute('data-nu-object-id')
  last.target = e.target.getAttribute('data-nu-target')
  last.code = e.target.value
  last.hash = nuHashFromEditForm()

  window.nuLOOKUPSTATE[last.object_id] = 'looking'

  const successCallback = function (data, textStatus, jqXHR) {
    nuSERVERRESPONSELU = data

    if (!nuDisplayError(data)) {
      nuChooseOneLookupRecord(e, data)
    }
  }

  nuAjax(last, successCallback)
}

function nuPrintAction () {
  const last = window.nuFORM.getCurrent()

  last.call_type = 'runhtml'
  last.browse_columns = nuSERVERRESPONSE.browse_columns
  last.browse_sql = nuSERVERRESPONSE.browse_sql
  last.session_id = window.nuSESSION

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (!nuDisplayError(fm)) {
      const p = 'core/nurunhtml.php?i=' + fm.id

      window.open(p)
    }
  }

  nuAjax(last, successCallback)
}

function nuUpdateData (action, instruction, close) {
  if (action == 'save' && window.nuBeforeSave) { if (nuBeforeSave() === false) { return } }
  if (action != 'save' && window.nuBeforeDelete) {
    if (nuBeforeDelete() === false) {
      $('#nuDelete').prop('checked', false)
      return
    }
  }

  if (action == 'save') {
    // nuSavingProgressMessage();
    nuSaveEditor()
  }

  if (nuFORM.getCurrent().record_id == -1) { nuSetProperty('NEW_RECORD', 1) }

  const current = window.nuFORM.getCurrent()
  const last = $.extend(true, {}, current)

  const f = last.form_id
  window.nuLASTRECORD = last.record_id

  if (arguments.length == 2) {
    last.instruction = instruction
  }

  last.call_type = 'update'
  last.deleteAll = $('#nuDelete').is(':checked') ? 'Yes' : 'No'
  last.nuFORMdata = nuFORM.data(action)
  last.hash = nuHashFromEditForm()
  last.session_id = window.nuSESSION

  $('.nuActionButton').hide()

  const successCallback = function (data, textStatus, jqXHR) {
    const fm = data

    if (nuDisplayError(fm)) {
      $('.nuActionButton').show()

      nuAbortSave()
    } else {
      if (fm.after_event) {
        nuMESSAGES = fm.errors
      }

      if ($('#nuDelete').prop('checked')) {
        if (action == 'delete' && instruction == 'all' && fm.record_id == '') {
          nuSearchAction()
          nuGetBreadcrumb()
          return
        }

        window.nuFORM.removeLast()						// -- return to browse

        if ($('.nuBreadcrumb').length == 0) {
          window.close()
        } else {
          nuGetBreadcrumb()
        }

        if (nuCurrentProperties() == undefined) {
          parent.$('#nuModal').remove()
          parent.$('#nuDragDialog').remove()
        }

        nuUpdateMessage('Record Deleted')
      } else {
        nuForm(f, fm.record_id, fm.filter, fm.search, 1)		// -- go to saved or created record
        nuUpdateMessage('Record Saved')

        if (instruction == 'close') {
          nuFORM.edited = false
          nuOpenPreviousBreadcrumb()
        }
      }
    }
  }

  nuAjax(last, successCallback, nuAbortSave)
}

function nuSaveAfterDrag () {
  const f = $('#nuDragDialog iframe')[0].contentWindow.nuFORM

  const last = f.getCurrent()

  last.call_type = 'nudragsave'
  last.nuDragState = $('#nuDragDialog iframe')[0].contentWindow.nuDragOptionsState

  const successCallback = function (data, textStatus, jqXHR) {
    if (nuDisplayError(data.errors)) {
      alert(data.errors[0])
    } else {
      $('div#nuDragDialog div#dialogTitle img#dialogClose').click()
      nuGetBreadcrumb()
    }

    $('#overlay').remove()
  }

  nuAjax(last, successCallback, nuAbortSaveDrag)
}

function nuOpenNewBrowserTab (c, f, r, filter) {
  if (window.nuNEW == 1) {
    window.nuNEW = 0

    window.nuOPENER.push(new nuOpener('F', f, r, filter))

    nuOpenerAppend('type', c)

    const len = window.nuOPENER.length - 1
    const id = window.nuOPENER[window.nuOPENER.length - 1].id
    const u = window.location.origin + window.location.pathname + '?i=' + len + '&opener=' + id

    window.open(u)

    return true
  }

  return false
}

function nuAbortSave () {
  $('#nuProgressUpdate').hide()
  $('.nuActionButton').show()
}
