
if (nuFormType() == 'browse') {
  if (!nuIsIframe()) {
    $('#nuRECORD').css({ width: '100vw', height: '85vh', 'overflow-x': 'auto', 'overflow-y': 'auto' })
    $('#nuBreadcrumbHolder').css({ width: '100vw', display: 'flex', flex: '1', 'flex-flow': 'row wrap' })
    $('#nuActionHolder').css({ width: '100vw' })
    $('.nuBrowseTitle').wrapAll('<div id= "btitle"></div>')
    // adding sticky nuBrowseTitle
    $('#nuRECORD').bind('scroll', function () {
      const scrollLeft = $('#nuRECORD').scrollLeft()
      const scrollTop = $('#nuRECORD').scrollTop()

      if (scrollTop >= 0 && scrollLeft >= 0) {
        $('#btitle').css({ 'z-index': '95', position: 'fixed', left: -scrollLeft + 'px' })
      } else {
        $('#btitle').css({ 'z-index': '0', position: 'absolute' })
      }
    })

    document.body.style.overflow = 'hidden'
  }
} else {
  document.body.style.overflow = 'visible'
}
