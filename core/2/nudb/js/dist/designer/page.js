'use strict'

/* global DesignerOfflineDB */
// js/designer/database.js
// eslint-disable-next-line no-unused-vars

/* global db, selectedPage:writable */
// js/designer/init.js

/* global DesignerMove */
// js/designer/move.js

/* global DesignerObjects */
// js/designer/objects.js
const DesignerPage = {}

DesignerPage.showTablesInLandingPage = function (db) {
  DesignerPage.loadFirstPage(db, function (page) {
    if (page) {
      DesignerPage.loadHtmlForPage(page.pgNr)
      selectedPage = page.pgNr
    } else {
      DesignerPage.showNewPageTables(true)
    }
  })
}

DesignerPage.saveToNewPage = function (db, pageName, tablePositions, callback) {
  DesignerPage.createNewPage(db, pageName, function (page) {
    if (page) {
      const tblCords = []

      const saveCallback = function (id) {
        tblCords.push(id)

        if (tablePositions.length === tblCords.length) {
          page.tblCords = tblCords
          DesignerOfflineDB.addObject('pdf_pages', page)
        }
      }

      for (let pos = 0; pos < tablePositions.length; pos++) {
        tablePositions[pos].pdfPgNr = page.pgNr
        DesignerPage.saveTablePositions(tablePositions[pos], saveCallback)
      }

      if (typeof callback !== 'undefined') {
        callback(page)
      }
    }
  })
}

DesignerPage.saveToSelectedPage = function (db, pageId, pageName, tablePositions, callback) {
  DesignerPage.deletePage(pageId)
  DesignerPage.saveToNewPage(db, pageName, tablePositions, function (page) {
    if (typeof callback !== 'undefined') {
      callback(page)
    }

    selectedPage = page.pgNr
  })
}

DesignerPage.createNewPage = function (db, pageName, callback) {
  const newPage = new DesignerObjects.PdfPage(db, pageName)
  DesignerOfflineDB.addObject('pdf_pages', newPage, function (pgNr) {
    newPage.pgNr = pgNr

    if (typeof callback !== 'undefined') {
      callback(newPage)
    }
  })
}

DesignerPage.saveTablePositions = function (positions, callback) {
  DesignerOfflineDB.addObject('table_coords', positions, callback)
}

DesignerPage.createPageList = function (db, callback) {
  DesignerOfflineDB.loadAllObjects('pdf_pages', function (pages) {
    let html = ''

    for (let p = 0; p < pages.length; p++) {
      const page = pages[p]

      if (page.dbName === db) {
        html += '<option value="' + page.pgNr + '">'
        html += Functions.escapeHtml(page.pageDescr) + '</option>'
      }
    }

    if (typeof callback !== 'undefined') {
      callback(html)
    }
  })
}

DesignerPage.deletePage = function (pageId, callback) {
  DesignerOfflineDB.loadObject('pdf_pages', pageId, function (page) {
    if (page) {
      for (let i = 0; i < page.tblCords.length; i++) {
        DesignerOfflineDB.deleteObject('table_coords', page.tblCords[i])
      }

      DesignerOfflineDB.deleteObject('pdf_pages', pageId, callback)
    }
  })
}

DesignerPage.loadFirstPage = function (db, callback) {
  DesignerOfflineDB.loadAllObjects('pdf_pages', function (pages) {
    let firstPage = null

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]

      if (page.dbName === db) {
        // give preference to a page having same name as the db
        if (page.pageDescr === db) {
          callback(page)
          return
        }

        if (firstPage === null) {
          firstPage = page
        }
      }
    }

    callback(firstPage)
  })
}

DesignerPage.showNewPageTables = function (check) {
  const allTables = $('#id_scroll_tab').find('td input:checkbox')
  allTables.prop('checked', check)

  for (let tab = 0; tab < allTables.length; tab++) {
    const input = allTables[tab]

    if (input.value) {
      const element = document.getElementById(input.value)
      element.style.top = DesignerPage.getRandom(550, 20) + 'px'
      element.style.left = DesignerPage.getRandom(700, 20) + 'px'
      DesignerMove.visibleTab(input, input.value)
    }
  }

  selectedPage = -1
  $('#page_name').text(Messages.strUntitled)
  DesignerMove.markUnsaved()
}

DesignerPage.loadHtmlForPage = function (pageId) {
  DesignerPage.showNewPageTables(true)
  DesignerPage.loadPageObjects(pageId, function (page, tblCords) {
    $('#name-panel').find('#page_name').text(page.pageDescr)
    let tableMissing = false

    for (let t = 0; t < tblCords.length; t++) {
      const tbId = db + '.' + tblCords[t].tableName
      const table = document.getElementById(tbId)

      if (table === null) {
        tableMissing = true
        continue
      }

      table.style.top = tblCords[t].y + 'px'
      table.style.left = tblCords[t].x + 'px'
      const checkbox = document.getElementById('check_vis_' + tbId)
      checkbox.checked = true
      DesignerMove.visibleTab(checkbox, checkbox.value)
    }

    DesignerMove.markSaved()

    if (tableMissing === true) {
      DesignerMove.markUnsaved()
      Functions.ajaxShowMessage(Messages.strSavedPageTableMissing)
    }

    selectedPage = page.pgNr
  })
}

DesignerPage.loadPageObjects = function (pageId, callback) {
  DesignerOfflineDB.loadObject('pdf_pages', pageId, function (page) {
    const tblCords = []
    const count = page.tblCords.length

    for (let i = 0; i < count; i++) {
      DesignerOfflineDB.loadObject('table_coords', page.tblCords[i], function (tblCord) {
        tblCords.push(tblCord)

        if (tblCords.length === count) {
          if (typeof callback !== 'undefined') {
            callback(page, tblCords)
          }
        }
      })
    }
  })
}

DesignerPage.getRandom = function (max, min) {
  const val = Math.random() * (max - min) + min
  return Math.floor(val)
}
