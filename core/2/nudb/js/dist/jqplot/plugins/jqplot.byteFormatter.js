'use strict';

/**
 * jqplot formatter for byte values
 *
 * @package phpMyAdmin
 */
(function ($) {
  'use strict'

  const formatByte = function (value, index) {
    let val = value
    let i = index
    const units = [Messages.strB, Messages.strKiB, Messages.strMiB, Messages.strGiB, Messages.strTiB, Messages.strPiB, Messages.strEiB]

    while (val >= 1024 && i <= 6) {
      val /= 1024
      i++
    }

    let format = '%.1f'

    if (Math.floor(val) === val) {
      format = '%.0f'
    }

    return $.jqplot.sprintf(format + ' ' + units[i], val)
  }
  /**
   * The index indicates what unit the incoming data will be in.
   * 0 for bytes, 1 for kilobytes and so on...
   *
   * @param index
   *
   * @return {String}
   */

  $.jqplot.byteFormatter = function (index) {
    const i = index || 0
    return function (format, value) {
      let val = value

      if (typeof val === 'number') {
        val = parseFloat(val) || 0
        return formatByte(val, i)
      } else {
        return String(val)
      }
    }
  }
})(jQuery)
