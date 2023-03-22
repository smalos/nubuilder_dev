showBrowseImages()
scaleImages()
$('#nuBrowseTitle3').css('text-align', 'left')
nuSetNoSearchColumns([2, 3])

$('[data-nu-column="0"]').each(function (index) {
  const code = '#nucell_' + index + '_'
  window.nuImages[$(code + '0').text()] = $(code + '2').text()
})

function showBrowseImages () {
  $('[data-nu-column="0"]').each(function (index) {
    const p = $(this).attr('id')
    const r = String(p).split('_')[1]
    const i = 'nucell_' + r + '_2'
    const e = 'nucell_' + r + '_3'
    const h = $('#' + i).html()

    if (h !== '' && h !== undefined) {
      nuEmbedObject(h, e, 140, 140)
    }
  })
}

function scaleImages () {
  $("[data-nu-column='3']").each(function (index) {
    const t = $(this)
    if (t.html().trim() !== '') {
      const embed = t.find('embed')
      if (t.length == 1) {
        const p = new Image()
        p.src = embed.attr('src')

        if (p.width < t.outerWidth() && p.height < t.outerHeight()) {
          embed.css({
            width: p.width,
            height: p.height
          })
          embed.css('height', p.height)
        }
      }
    }
  })
}
