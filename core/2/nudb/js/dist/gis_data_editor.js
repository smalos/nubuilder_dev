'use strict'

/**
 * @fileoverview    functions used in GIS data editor
 *
 * @requires    jQuery
 *
 */

/* global addZoomPanControllers, storeGisSvgRef, selectVisualization, styleOSM, zoomAndPan */
// js/table/gis_visualization.js

/* global themeImagePath */
// templates/javascript/variables.twig
// eslint-disable-next-line no-unused-vars
let gisEditorLoaded = false
/**
 * Closes the GIS data editor and perform necessary clean up work.
 */

function closeGISEditor () {
  $('#popup_background').fadeOut('fast')
  $('#gis_editor').fadeOut('fast', function () {
    $(this).empty()
  })
}
/**
 * Prepares the HTML received via AJAX.
 */

function prepareJSVersion () {
  // Change the text on the submit button
  $('#gis_editor').find('input[name=\'gis_data[save]\']').val(Messages.strCopy).insertAfter($('#gis_data_textarea')).before('<br><br>') // Add close and cancel links

  $('#gis_data_editor').prepend('<a class="close_gis_editor" href="#">' + Messages.strClose + '</a>')
  $('<a class="cancel_gis_editor" href="#"> ' + Messages.strCancel + '</a>').insertAfter($('input[name=\'gis_data[save]\']')) // Remove the unnecessary text

  $('div#gis_data_output p').remove() // Remove 'add' buttons and add links

  $('#gis_editor').find('input.add').each(function () {
    const $button = $(this)
    $button.addClass('addJs').removeClass('add')
    const classes = $button.attr('class')
    $button.replaceWith('<a class="' + classes + '" name="' + $button.attr('name') + '" href="#">+ ' + $button.val() + '</a>')
  })
}
/**
 * Returns the HTML for a data point.
 *
 * @param {number} pointNumber point number
 * @param {string} prefix      prefix of the name
 * @return {string} the HTML for a data point
 */

function addDataPoint (pointNumber, prefix) {
  return '<br>' + Functions.sprintf(Messages.strPointN, pointNumber + 1) + ': ' + '<label for="x">' + Messages.strX + '</label>' + '<input type="text" name="' + prefix + '[' + pointNumber + '][x]" value="">' + '<label for="y">' + Messages.strY + '</label>' + '<input type="text" name="' + prefix + '[' + pointNumber + '][y]" value="">'
}
/**
 * Initialize the visualization in the GIS data editor.
 */

function initGISEditorVisualization () {
  storeGisSvgRef() // Loads either SVG or OSM visualization based on the choice

  selectVisualization() // Adds necessary styles to the div that contains the openStreetMap

  styleOSM() // Adds controllers for zooming and panning

  addZoomPanControllers()
  zoomAndPan()
}
/**
 * Loads JavaScript files and the GIS editor.
 *
 * @param value      current value of the geometry field
 * @param field      field name
 * @param type       geometry type
 * @param inputName name of the input field
 * @param token      token
 */
// eslint-disable-next-line no-unused-vars

function loadJSAndGISEditor (value, field, type, inputName) {
  const head = document.getElementsByTagName('head')[0]
  let script // Loads a set of small JS file needed for the GIS editor

  const smallScripts = ['js/vendor/jquery/jquery.svg.js', 'js/vendor/jquery/jquery.mousewheel.js', 'js/dist/table/gis_visualization.js']

  for (let i = 0; i < smallScripts.length; i++) {
    script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = smallScripts[i]
    head.appendChild(script)
  } // OpenLayers.js is BIG and takes time. So asynchronous loading would not work.
  // Load the JS and do a callback to load the content for the GIS Editor.

  script = document.createElement('script')
  script.type = 'text/javascript'

  script.onreadystatechange = function () {
    if (this.readyState === 'complete') {
      loadGISEditor(value, field, type, inputName)
    }
  }

  script.onload = function () {
    loadGISEditor(value, field, type, inputName)
  }

  script.onerror = function () {
    loadGISEditor(value, field, type, inputName)
  }

  script.src = 'js/vendor/openlayers/OpenLayers.js'
  head.appendChild(script)
  gisEditorLoaded = true
}
/**
 * Loads the GIS editor via AJAX
 *
 * @param value      current value of the geometry field
 * @param field      field name
 * @param type       geometry type
 * @param inputName name of the input field
 */

function loadGISEditor (value, field, type, inputName) {
  const $gisEditor = $('#gis_editor')
  $.post('index.php?route=/gis-data-editor', {
    field,
    value,
    type,
    input_name: inputName,
    get_gis_editor: true,
    ajax_request: true,
    server: CommonParams.get('server')
  }, function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      $gisEditor.html(data.gis_editor)
      initGISEditorVisualization()
      prepareJSVersion()
    } else {
      Functions.ajaxShowMessage(data.error, false)
    }
  }, 'json')
}
/**
 * Opens up the dialog for the GIS data editor.
 */
// eslint-disable-next-line no-unused-vars

function openGISEditor () {
  // Center the popup
  const windowWidth = document.documentElement.clientWidth
  const windowHeight = document.documentElement.clientHeight
  const popupWidth = windowWidth * 0.9
  const popupHeight = windowHeight * 0.9
  const popupOffsetTop = windowHeight / 2 - popupHeight / 2
  const popupOffsetLeft = windowWidth / 2 - popupWidth / 2
  const $gisEditor = $('#gis_editor')
  const $background = $('#popup_background')
  $gisEditor.css({
    top: popupOffsetTop,
    left: popupOffsetLeft,
    width: popupWidth,
    height: popupHeight
  })
  $background.css({
    opacity: '0.7'
  })
  $gisEditor.append('<div id="gis_data_editor">' + '<img class="ajaxIcon" id="loadingMonitorIcon" src="' + themeImagePath + 'ajax_clock_small.gif" alt="">' + '</div>') // Make it appear

  $background.fadeIn('fast')
  $gisEditor.fadeIn('fast')
}
/**
 * Prepare and insert the GIS data in Well Known Text format
 * to the input field.
 */

function insertDataAndClose () {
  const $form = $('form#gis_data_editor_form')
  const inputName = $form.find('input[name=\'input_name\']').val()
  const argsep = CommonParams.get('arg_separator')
  $.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'generate=true' + argsep + 'ajax_request=true', function (data) {
    if (typeof data !== 'undefined' && data.success === true) {
      $('input[name=\'' + inputName + '\']').val(data.result)
    } else {
      Functions.ajaxShowMessage(data.error, false)
    }
  }, 'json')
  closeGISEditor()
}
/**
 * Unbind all event handlers before tearing down a page
 */

AJAX.registerTeardown('gis_data_editor.js', function () {
  $(document).off('click', '#gis_editor input[name=\'gis_data[save]\']')
  $(document).off('submit', '#gis_editor')
  $(document).off('change', '#gis_editor input[type=\'text\']')
  $(document).off('change', '#gis_editor select.gis_type')
  $(document).off('click', '#gis_editor a.close_gis_editor, #gis_editor a.cancel_gis_editor')
  $(document).off('click', '#gis_editor a.addJs.addPoint')
  $(document).off('click', '#gis_editor a.addLine.addJs')
  $(document).off('click', '#gis_editor a.addJs.addPolygon')
  $(document).off('click', '#gis_editor a.addJs.addGeom')
})
AJAX.registerOnload('gis_data_editor.js', function () {
  /**
   * Prepares and insert the GIS data to the input field on clicking 'copy'.
   */
  $(document).on('click', '#gis_editor input[name=\'gis_data[save]\']', function (event) {
    event.preventDefault()
    insertDataAndClose()
  })
  /**
   * Prepares and insert the GIS data to the input field on pressing 'enter'.
   */

  $(document).on('submit', '#gis_editor', function (event) {
    event.preventDefault()
    insertDataAndClose()
  })
  /**
   * Trigger asynchronous calls on data change and update the output.
   */

  $(document).on('change', '#gis_editor input[type=\'text\']', function () {
    const $form = $('form#gis_data_editor_form')
    const argsep = CommonParams.get('arg_separator')
    $.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'generate=true' + argsep + 'ajax_request=true', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        $('#gis_data_textarea').val(data.result)
        $('#placeholder').empty().removeClass('hasSVG').html(data.visualization)
        $('#openlayersmap').empty()
        /* TODO: the gis_data_editor should rather return JSON than JS code to eval */
        // eslint-disable-next-line no-eval

        eval(data.openLayers)
        initGISEditorVisualization()
      } else {
        Functions.ajaxShowMessage(data.error, false)
      }
    }, 'json')
  })
  /**
   * Update the form on change of the GIS type.
   */

  $(document).on('change', '#gis_editor select.gis_type', function () {
    const $gisEditor = $('#gis_editor')
    const $form = $('form#gis_data_editor_form')
    const argsep = CommonParams.get('arg_separator')
    $.post('index.php?route=/gis-data-editor', $form.serialize() + argsep + 'get_gis_editor=true' + argsep + 'ajax_request=true', function (data) {
      if (typeof data !== 'undefined' && data.success === true) {
        $gisEditor.html(data.gis_editor)
        initGISEditorVisualization()
        prepareJSVersion()
      } else {
        Functions.ajaxShowMessage(data.error, false)
      }
    }, 'json')
  })
  /**
   * Handles closing of the GIS data editor.
   */

  $(document).on('click', '#gis_editor a.close_gis_editor, #gis_editor a.cancel_gis_editor', function () {
    closeGISEditor()
  })
  /**
   * Handles adding data points
   */

  $(document).on('click', '#gis_editor a.addJs.addPoint', function () {
    const $a = $(this)
    const name = $a.attr('name') // Eg. name = gis_data[0][MULTIPOINT][add_point] => prefix = gis_data[0][MULTIPOINT]

    const prefix = name.substr(0, name.length - 11) // Find the number of points

    const $noOfPointsInput = $('input[name=\'' + prefix + '[no_of_points]' + '\']')
    const noOfPoints = parseInt($noOfPointsInput.val(), 10) // Add the new data point

    const html = addDataPoint(noOfPoints, prefix)
    $a.before(html)
    $noOfPointsInput.val(noOfPoints + 1)
  })
  /**
   * Handles adding linestrings and inner rings
   */

  $(document).on('click', '#gis_editor a.addLine.addJs', function () {
    const $a = $(this)
    const name = $a.attr('name') // Eg. name = gis_data[0][MULTILINESTRING][add_line] => prefix = gis_data[0][MULTILINESTRING]

    const prefix = name.substr(0, name.length - 10)
    const type = prefix.slice(prefix.lastIndexOf('[') + 1, prefix.lastIndexOf(']')) // Find the number of lines

    const $noOfLinesInput = $('input[name=\'' + prefix + '[no_of_lines]' + '\']')
    const noOfLines = parseInt($noOfLinesInput.val(), 10) // Add the new linesting of inner ring based on the type

    let html = '<br>'
    let noOfPoints

    if (type === 'MULTILINESTRING') {
      html += Messages.strLineString + ' ' + (noOfLines + 1) + ':'
      noOfPoints = 2
    } else {
      html += Messages.strInnerRing + ' ' + noOfLines + ':'
      noOfPoints = 4
    }

    html += '<input type="hidden" name="' + prefix + '[' + noOfLines + '][no_of_points]" value="' + noOfPoints + '">'

    for (let i = 0; i < noOfPoints; i++) {
      html += addDataPoint(i, prefix + '[' + noOfLines + ']')
    }

    html += '<a class="addPoint addJs" name="' + prefix + '[' + noOfLines + '][add_point]" href="#">+ ' + Messages.strAddPoint + '</a><br>'
    $a.before(html)
    $noOfLinesInput.val(noOfLines + 1)
  })
  /**
   * Handles adding polygons
   */

  $(document).on('click', '#gis_editor a.addJs.addPolygon', function () {
    const $a = $(this)
    const name = $a.attr('name') // Eg. name = gis_data[0][MULTIPOLYGON][add_polygon] => prefix = gis_data[0][MULTIPOLYGON]

    const prefix = name.substr(0, name.length - 13) // Find the number of polygons

    const $noOfPolygonsInput = $('input[name=\'' + prefix + '[no_of_polygons]' + '\']')
    const noOfPolygons = parseInt($noOfPolygonsInput.val(), 10) // Add the new polygon

    let html = Messages.strPolygon + ' ' + (noOfPolygons + 1) + ':<br>'
    html += '<input type="hidden" name="' + prefix + '[' + noOfPolygons + '][no_of_lines]" value="1">' + '<br>' + Messages.strOuterRing + ':' + '<input type="hidden" name="' + prefix + '[' + noOfPolygons + '][0][no_of_points]" value="4">'

    for (let i = 0; i < 4; i++) {
      html += addDataPoint(i, prefix + '[' + noOfPolygons + '][0]')
    }

    html += '<a class="addPoint addJs" name="' + prefix + '[' + noOfPolygons + '][0][add_point]" href="#">+ ' + Messages.strAddPoint + '</a><br>' + '<a class="addLine addJs" name="' + prefix + '[' + noOfPolygons + '][add_line]" href="#">+ ' + Messages.strAddInnerRing + '</a><br><br>'
    $a.before(html)
    $noOfPolygonsInput.val(noOfPolygons + 1)
  })
  /**
   * Handles adding geoms
   */

  $(document).on('click', '#gis_editor a.addJs.addGeom', function () {
    const $a = $(this)
    const prefix = 'gis_data[GEOMETRYCOLLECTION]' // Find the number of geoms

    const $noOfGeomsInput = $('input[name=\'' + prefix + '[geom_count]' + '\']')
    const noOfGeoms = parseInt($noOfGeomsInput.val(), 10)
    const html1 = Messages.strGeometry + ' ' + (noOfGeoms + 1) + ':<br>'
    const $geomType = $('select[name=\'gis_data[' + (noOfGeoms - 1) + '][gis_type]\']').clone()
    $geomType.attr('name', 'gis_data[' + noOfGeoms + '][gis_type]').val('POINT')
    const html2 = '<br>' + Messages.strPoint + ' :' + '<label for="x"> ' + Messages.strX + ' </label>' + '<input type="text" name="gis_data[' + noOfGeoms + '][POINT][x]" value="">' + '<label for="y"> ' + Messages.strY + ' </label>' + '<input type="text" name="gis_data[' + noOfGeoms + '][POINT][y]" value="">' + '<br><br>'
    $a.before(html1)
    $geomType.insertBefore($a)
    $a.before(html2)
    $noOfGeomsInput.val(noOfGeoms + 1)
  })
})
