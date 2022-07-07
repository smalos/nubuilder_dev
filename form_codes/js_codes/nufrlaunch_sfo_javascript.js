
$('#wrdaddable').css({'font-size' : 14, 'font-weight' : 700, 'padding' : 5}).addClass('nuTabHolder');
$('#frwrd').css({'font-size' : 14, 'font-weight' : 700, 'padding' : 5}).addClass('nuTabHolder');
$('#nufr').css({'text-align' : 'left', 'height' : 410, 'background-color': '#ebebeb'});

$('#list').addClass('nuScroll').removeClass('nuReadonly');

$('.nuActionButton').hide();
nuAddActionButton('nuRunPHPHidden', 'Build Fast Report', 'nuRunPHPHidden("RUNFR")');


function nuAddReportField(t){

    var f   = nuPad3($("[data-nu-label='Field Name']").length - 1);

    $('#fast_report_sf' + f + 'field').val($(t).html()).change();
    $('#fast_report_sf' + f + 'width').val(100).change();
    $('#fast_report_sf' + f + 'sum').val('no').change();
    $('#fast_report_sf' + f + 'title').val($(t).html()).change().select();
    
}


function nuBeforeSave(){
    
    if($('#table').val() === ''){
        
        nuMessage(['<b>Table Data</b>', nuTranslate('Cannot be left blank...')])
        return false;
        
    }
    
    
    if($('#orderby').val() === ''){
        
        nuMessage(['<b>Order By</b>', nuTranslate('Cannot be left blank...')])
        return false;
        
    }
    
    nuBuildFastReport();
    
    return true;
    
}

