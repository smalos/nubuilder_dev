$('#nuAddButton').remove();
$('#nuBreadcrumb1').remove();

function nuOnAddAction() {
    return false;
}


// JavaScript column: Replace \n with html br
$("[data-nu-column=3]").each(function() {
    $(this).html($(this).html().replaceAll(' ', '&nbsp').replace(/\n/g, "<br />"));
});