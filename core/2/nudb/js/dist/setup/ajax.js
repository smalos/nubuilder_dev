'use strict'

/* eslint-disable no-unused-vars */

/**
 * Dummy implementation of the ajax page loader
 */
const AJAX = {
  registerOnload: function (idx, func) {
    $(func)
  },
  registerTeardown: function (idx, func) {}
}
