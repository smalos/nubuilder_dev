$(document).ready(function () {

	$(".nuRECORD  [data-nu-label]").not("#sus_zzzzsys_access_id").each(function (index) {

		$(this).next("label").addBack().wrapAll("<div class='form-element-wrapper' />");
		$('.nuHiddenLookup,.input_text,.nuNone,iframe,select,.nuLookupCode,.nuLookupButton, .nuLookupDescription, .input_checkbox,.input_button,.input_nuDate,.input_number,.input_nuNumber,.nuDuplicateOrBlank,.nuBlank,.input_password').css({
			'top': '',
			'left': '',
			'width': '',
			'position': '',
			'height': ''
		});

	});
	$("#label_f_fee2,#f_fee2 ").wrapAll('<div class="form-element-wrapper"></div>');

	$("#label_sus_language,#sus_language").wrapAll('<div class="form-element-wrapper"></div>');
	$("#sus_zzzzsys_access_id_open_button,#sus_zzzzsys_access_idcode,#sus_zzzzsys_access_idbutton,#sus_zzzzsys_access_iddescription").wrapAll('<div class="lookup"></div>');
	$("#label_sus_zzzzsys_access_id,.lookup").wrapAll('<div id="lu" class="form-element-wrapper"></div>');
	$(".form-element-wrapper").wrapAll('<form class="container"></form>');
	$(".nuContentBoxContainer").hide();
	$('div:empty').remove();

});
