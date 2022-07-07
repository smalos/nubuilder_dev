function colorObjectTypes() {

    // Color Types
    $('select[id$=sob_all_type]').find('option').each(function(index,element){
        $(element).addClass('nu_' + element.value);
    });
    
    $('select[id$=sob_all_type]').each(function(index,element){
        
    	$(element).removeClass();
    	$(element).addClass('nu_' + element.value);
    });

}

function afterinsertrowObjects() {
   colorObjectTypes();
}

function nuSortSubform(s, c, e){
}

if (nuFormType() == 'edit') {


    const OPTION_ALL = '(' + nuTranslate('All')  + ')';
    
    var sfFilter = {};
    sfFilter['objform']  = {
    	'sob_all_zzzzsys_tab_id': {type: 'select', blank: false, all: OPTION_ALL},
    	'sob_all_id': {type: 'search', placeholder: nuTranslate('Search')},
    	'sob_all_type': {type: 'select', blank: false, all: OPTION_ALL},
    	'sob_all_label': {type: 'search', placeholder: nuTranslate('Search')}
    };
    
    nuSubformAddFilter(sfFilter);

    $('#nuCloneButton').remove();
    $('#nuDeleteButton').remove();

    colorObjectTypes();

    $('#title_objformbtnOpenDetails').html(nuTranslate('Details'));

    if (nuIsNewRecord()) {
        nuSetTitle(nuTranslate('New'));
    } else {
        var frmInfo = $('#sfo_description').val() + ' ('+ $('#sfo_code').val()+')';
        if (window.nuFORM.breadcrumbs.length == 1) $('#nuTab0').html(frmInfo);
        nuSetTitle(frmInfo);
        nuUpdateAclCount();
    }
}

function nuFormColor() {

    var t = String($('#sfo_type').val());

    var pb = 'previewbrowse';
    var pe = 'previewedit';

    var bb = 'bb_event';
    var be = 'be_event';
    var bs = 'bs_event';
    var as = 'as_event';
    var bd = 'bd_event';
    var ad = 'ad_event';

    if (t == 'browse') {
        nuDisable([pe, be, bs, as, bd, ad]);
    } else
    if (t == 'edit') {
        nuDisable([pb, pb]);
    } else
    if (t == 'launch') {
        nuDisable([pb, bb, bs, as, bd, ad]);
    } else
    if (t == 'subform') {
        nuDisable([pb, bb, be, bs, as, bd, ad]);
        nuDisable('sfo_javascript');
    }

    var h = $('#sfo_type').addClass('nuEdited');
    var o = [];
    o.browse = [0, 1, 2];
    o.edit = [0, 2];
    o.browseedit = [0, 1, 2];
    o.launch = [0, 2];
    o.subform = [0, 1];

    $('#sfo_type').removeClass();
    $('#sfo_type').addClass('nu_' + $('#sfo_type').val());

    if (h) {
        $('#sfo_type').addClass('nuEdited');
    }

    $("#sfo_type > option").each(function() {
        $(this).addClass('nu_' + this.value);
    });

    for (var i = 0; i < 7; i++) {
        $('#nuTab' + i).removeClass('nuRelatedTab');
    }

    t = o[$('#sfo_type').val()];
    if (t !== undefined) {

        for (i = 0; i < t.length; i++) {
            $('#nuTab' + t[i]).addClass('nuRelatedTab');
        }

    }

}

function nuEventList() {

    if ($('sob_all_type').val() == 'subform') {
        return ['onchange', 'onadd'];
    } else {
        return ['onblur', 'onchange', 'onfocus', 'onkeydown'];
    }

}

function default_description() {

    var s = 'zzzzsys_browse_sf';
    var r = nuSubformObject(s).rows.length - 1;
    var o = s + nuPad3(r) + 'sbr_title';
    
    nuSetPlaceholder(o, 'Something');
 
}

function nuUpdateAclCount() {
	var l = $("[data-nu-field='slf_zzzzsys_access_id']").length -2;
	var t = l <= 0 ? '' : ' (' + l + ')';
	$('#nuTab4').html(nuTranslate('Access Level') + t);
}


function createButton(target, pk, formType) {
	
	var btn = $("<button id='nuPreviewButton' type='button' data-form-type='"+ formType +"' class='nuActionButton'><i class='fa fa-search'></i>&nbsp;</button>");

	$(target).html(btn).attr('title',nuTranslate('Preview Form'));
	btn.on('click',function(){
	    var formType = $(this).attr("data-form-type");
	    var r = formType == 'launch' || formType == 'edit' || formType == 'subform'  ? '-1' : '';
	    nuForm(pk,r,'','');
	});
}

function addRowButtons(column) {
  
  $("[data-nu-column='" + column + "']").each(function(index) {
      
      var pk = $(this).attr('data-nu-primary-key');
      var r = $(this).attr('data-nu-row');
      var formType = $('#nucell_'+ r + '_1').html();
      
      if (typeof pk !== "undefined") {
          createButton(this, pk, formType);
      }
  })

}

