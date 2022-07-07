
nuSetToolTip('sse_resize','Resize');
$('#sse_sql').css('z-index', 1);
nuLabelOnTop(['nusvg']);



if(nuIsNewRecord()){
    $('#sse_edit').val(0);
}

$("#sse_edit option[value='']").remove();

$('#sse_sql')
.css('font-size', 10)
.addClass('sql')
.dblclick(function() {
	nuOpenAce('SQL', this.id);
});

$('#label_sse_sql').remove();
nuHide('sse_code_snippet_lookupcode');
nuSetSnippetFormFilter(0,0,1);

$('#sse_resize').addClass('nuAllowDblClick');

nuSetSFCB();

if(window.filter == 'justsql'){

    var sid     = String(nuFORM.getCurrent().record_id);
    var from    = sid.substring(sid.length-2);
    var targ    = '#sfo_browse_sql';

    $('#nuDeleteButton').remove();
    $('#nuCloneButton').remove();
    $('#sse_description').val(sid);
    
    nuHide('sse_description');
    
    if(nuFORM.getCurrent().record_id != -1){
    
        $('#nuSaveButton').hide();
    
        if(from == 'BR'){
            nuAddActionButton('SaveToTextarea', 'Copy to Form Browse SQL', 'nuCopySQL("sfo_browse_sql")');
        }
        
        if(from == 'SE'){
            nuAddActionButton('SaveToTextarea', 'Copy to Select Object SQL', 'nuCopySQL("sob_select_sql")');
        }
        

        if(from == 'DI'){
            nuAddActionButton('SaveToTextarea', 'Copy to Display Object SQL', 'nuCopySQL("sob_display_sql")');
        }
        
    }

}





$('#sse_sql').css('overflow-x','scroll');


nuWhereClauses();


function nuCopySQL(target){
    
    var s   = $('#sse_sql').val();
    
    parent.$('#' + target).val(s).change();
    
    parent.$('#dialogClose').click();

}


function nuTempPHP(){
    
    var p   = [];
    
    p.push('');
    p.push('$sql = "');
    p.push('');
    p.push('CREATE TABLE #TABLE_ID#');
    p.push($('#sse_sql').val());
    p.push('');
    p.push('";');
    p.push('');
    p.push("nuRunQuery($sql);");
    p.push('');
    nuMessage(p);

    $("#nuMessageDiv").css('text-align', 'left');

}

function nuBeforeSave(){
    
    $('#sqlframe')[0].contentWindow.nuSQL.buildSQL();
    return true;
    
}




function nuWhereClauses(){

	$("[id$='ssc_type']select").each(function(index){
		
		var p   = $(this).attr('data-nu-prefix');
		var t   = $(this).val();
		
		if(t == 2 || t == 3){
		    
		    if($('#' + p + 'ssc_sort').val() == ''){
                $('#' + p + 'ssc_sort').val('ASC');
		    }
		    
    		$('#' + p + 'ssc_clause').hide();
    		$('#' + p + 'ssc_sort').show();
    		
		}else{
		    
    		$('#' + p + 'ssc_clause').show();
    		$('#' + p + 'ssc_sort').hide();
    		
		}

	});

}


function nuWhereClausesold(){

	$("[id$='ssc_type']select").each(function(index){
		
		var p   = $(this).attr('data-nu-prefix');
		var t   = $(this).val();
		
		if(t == 2 || t == 3){
		    
		    if($('#' + p + 'ssc_sort').val() == ''){
                $('#' + p + 'ssc_sort').val('ASC');
		    }
		    
    		$('#' + p + 'ssc_clause').hide();
    		$('#' + p + 'ssc_sort').show();
    		
		}else{
		    
    		$('#' + p + 'ssc_clause').show();
    		$('#' + p + 'ssc_sort').hide();
    		
		}

	});

}


function nuAddSQLTable(e){
  
    var s = $('#sqlframe')[0].contentWindow.nuSQL;
    
    s.addBox(e.target.value);
    e.target.value  = '';
    s.buildSQL();

}


function nuSFCB(){
    
    nuWhereClauses();
    $('#sqlframe')[0].contentWindow.nuSQL.buildSQL();

}


function nuSetSFCB(){
    
    $('.nuSubformCheckbox.zzzzsys_select_clause')
	.click(function(){
		nuSFCB();
    });
    
}



function nuResizeSQL(){

    if($('#sqlframe').css('height') == '460px'){
        $('#sqlframe').css('height', 700);
    }else{
        $('#sqlframe').css('height', 460);
    }
    
}


