if (nuFormType() == 'browse') {
  if (!nuIsIframe()) {
    $('#nuRECORD').css({ width: '100vw', height: '85vh', 'overflow-x': 'auto', 'overflow-y': 'auto' })
    $('#nuBreadcrumbHolder').css({ width: '100vw', display: 'flex', flex: '1', 'flex-flow': 'row wrap' })
    $('#nuActionHolder').css({ width: '100vw' })
    document.body.style.overflow = 'hidden'
  }
} else {
  document.body.style.overflow = 'visible'
}
