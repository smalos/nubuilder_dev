'use strict'

/**
 * @fileoverview    function used in QBE for DB
 * @name            Database Operations
 *
 * @requires    jQuery
 * @requires    jQueryUI
 * @requires    js/functions.js
 * @requires    js/database/query_generator.js
 *
 */

/* global generateFromBlock, generateWhereBlock */
// js/database/query_generator.js

/**
 * js file for handling AJAX and other events in /database/multi-table-query
 */

/**
 * Unbind all event handlers before tearing down a page
 */
AJAX.registerTeardown('database/multi_table_query.js', function () {
  $('.tableNameSelect').each(function () {
    $(this).off('change')
  })
  $('#update_query_button').off('click')
  $('#add_column_button').off('click')
})
AJAX.registerOnload('database/multi_table_query.js', function () {
  const editor = Functions.getSqlEditor($('#MultiSqlquery'), {}, 'both')
  $('.CodeMirror-line').css('text-align', 'left')
  editor.setSize(-1, 50)
  let columnCount = 3
  addNewColumnCallbacks()
  $('#update_query_button').on('click', function () {
    const columns = []
    const tableAliases = {}
    $('.tableNameSelect').each(function () {
      const $show = $(this).siblings('.show_col').first()

      if ($(this).val() !== '' && $show.prop('checked')) {
        const tableAlias = $(this).siblings('.table_alias').first().val()
        const columnAlias = $(this).siblings('.col_alias').first().val()

        if (tableAlias !== '') {
          columns.push([tableAlias, $(this).siblings('.columnNameSelect').first().val()])
        } else {
          columns.push([$(this).val(), $(this).siblings('.columnNameSelect').first().val()])
        }

        columns[columns.length - 1].push(columnAlias)

        if ($(this).val() in tableAliases) {
          if (!tableAliases[$(this).val()].includes(tableAlias)) {
            tableAliases[$(this).val()].push(tableAlias)
          }
        } else {
          tableAliases[$(this).val()] = [tableAlias]
        }
      }
    })

    if (Object.keys(tableAliases).length === 0) {
      Functions.ajaxShowMessage('Nothing selected', false, 'error')
      return
    }

    let foreignKeys
    $.ajax({
      type: 'GET',
      async: false,
      url: 'index.php?route=/database/multi-table-query/tables',
      data: {
        server: sessionStorage.server,
        db: $('#db_name').val(),
        tables: Object.keys(tableAliases),
        ajax_request: '1',
        token: CommonParams.get('token')
      },
      success: function (response) {
        foreignKeys = response.foreignKeyConstrains
      }
    })
    let query = 'SELECT ' + '`' + Functions.escapeBacktick(columns[0][0]) + '`.'

    if (columns[0][1] === '*') {
      query += '*'
    } else {
      query += '`' + Functions.escapeBacktick(columns[0][1]) + '`'
    }

    if (columns[0][2] !== '') {
      query += ' AS `' + Functions.escapeBacktick(columns[0][2]) + '`'
    }

    for (let i = 1; i < columns.length; i++) {
      query += ', `' + Functions.escapeBacktick(columns[i][0]) + '`.'

      if (columns[i][1] === '*') {
        query += '*'
      } else {
        query += '`' + Functions.escapeBacktick(columns[i][1]) + '`'
      }

      if (columns[i][2] !== '') {
        query += ' AS `' + Functions.escapeBacktick(columns[i][2]) + '`'
      }
    }

    query += '\nFROM '
    query += generateFromBlock(tableAliases, foreignKeys)
    const $criteriaColCount = $('.criteria_col:checked').length

    if ($criteriaColCount > 0) {
      query += '\nWHERE '
      query += generateWhereBlock()
    }

    query += ';'
    editor.getDoc().setValue(query)
  })
  $('#submit_query').on('click', function () {
    const query = editor.getDoc().getValue() // Verifying that the query is not empty

    if (query === '') {
      Functions.ajaxShowMessage(Messages.strEmptyQuery, false, 'error')
      return
    }

    const data = {
      db: $('#db_name').val(),
      sql_query: query,
      ajax_request: '1',
      server: CommonParams.get('server'),
      token: CommonParams.get('token')
    }
    $.ajax({
      type: 'POST',
      url: 'index.php?route=/database/multi-table-query/query',
      data,
      success: function (data) {
        const $resultsDom = $(data.message)
        $resultsDom.find('.ajax:not(.pageselector)').each(function () {
          $(this).on('click', function (event) {
            event.preventDefault()
          })
        })
        $resultsDom.find('.autosubmit, .pageselector, .showAllRows, .filter_rows').each(function () {
          $(this).on('change click select focus', function (event) {
            event.preventDefault()
          })
        })
        $('#sql_results').html($resultsDom)
        $('#slide-handle').trigger('click') // Collapse search criteria area
      }
    })
  })
  $('#add_column_button').on('click', function () {
    columnCount++
    const $newColumnDom = $($('#new_column_layout').html()).clone()
    $newColumnDom.find('.jsCriteriaButton').first().attr('data-bs-target', '#criteriaOptionsExtra' + columnCount.toString())
    $newColumnDom.find('.jsCriteriaButton').first().attr('aria-controls', 'criteriaOptionsExtra' + columnCount.toString())
    $newColumnDom.find('.jsCriteriaOptions').first().attr('id', 'criteriaOptionsExtra' + columnCount.toString())
    $('#add_column_button').parent().before($newColumnDom)
    addNewColumnCallbacks()
  })

  function addNewColumnCallbacks () {
    $('.tableNameSelect').each(function () {
      $(this).on('change', function () {
        let $sibs = $(this).siblings('.columnNameSelect')

        if ($sibs.length === 0) {
          $sibs = $(this).parent().parent().find('.columnNameSelect')
        }

        $sibs.first().html($('#' + $(this).find(':selected').data('hash')).html())
      })
    })
    $('.jsRemoveColumn').each(function () {
      $(this).on('click', function () {
        $(this).parent().remove()
      })
    })
    $('.jsCriteriaButton').each(function () {
      $(this).on('click', function (event, from) {
        if (from === null) {
          const $checkbox = $(this).siblings('.criteria_col').first()
          $checkbox.prop('checked', !$checkbox.prop('checked'))
        }

        const $criteriaColCount = $('.criteria_col:checked').length

        if ($criteriaColCount > 1) {
          $(this).siblings('.jsCriteriaOptions').first().find('.logical_operator').first().css('display', 'table-row')
        }
      })
    })
    $('.criteria_col').each(function () {
      $(this).on('change', function () {
        const $anchor = $(this).siblings('.jsCriteriaButton').first()
        $anchor.trigger('click', ['Trigger'])
      })
    })
    $('.criteria_rhs').each(function () {
      $(this).on('change', function () {
        const $rhsCol = $(this).parent().parent().siblings('.rhs_table').first()
        const $rhsText = $(this).parent().parent().siblings('.rhs_text').first()

        if ($(this).val() === 'text') {
          $rhsCol.css('display', 'none')
          $rhsText.css('display', 'table-row')
        } else if ($(this).val() === 'anotherColumn') {
          $rhsText.css('display', 'none')
          $rhsCol.css('display', 'table-row')
        } else {
          $rhsText.css('display', 'none')
          $rhsCol.css('display', 'none')
        }
      })
    })
  }
})
