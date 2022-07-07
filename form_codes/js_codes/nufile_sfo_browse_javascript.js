showBrowseImages();
scaleImages();
$('#nuBrowseTitle3').css('text-align', 'left');
nuSetNoSearchColumns([2, 3]);

$('[data-nu-column="0"]').each(function(index) {
    var code = '#nucell_' + index + '_';
    window.nuImages[$(code + '0').text()] = $(code + '2').text();
});

function showBrowseImages() {

    $('[data-nu-column="0"]').each(function(index) {

        var p = $(this).attr('id');
        var r = String(p).split('_')[1];
        var i = "nucell_" + r + "_2";
        var e = "nucell_" + r + "_3";
        var h = $('#' + i).html();

        if (h !== '' && h !== undefined) {

            nuEmbedObject(h, e, 140, 140);

        }

    });

}


function scaleImages() {

    $("[data-nu-column='3']").each(function(index) {

        var t = $(this);
        if (t.html().trim() !== '') {

            var embed = t.find('embed');
            if (t.length == 1) {

                var p = new Image();
                p.src = embed.attr('src');

                if (p.width < t.outerWidth() && p.height < t.outerHeight()) {
                    embed.css({
                        'width': p.width,
                        'height': p.height
                    });
                    embed.css('height', p.height);
                }

            }
        }

    });

}