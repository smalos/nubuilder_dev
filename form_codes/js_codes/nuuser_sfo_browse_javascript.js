$(function() { 
    nuAddBrowseTitleSelect(9, ["", "Expired"]); 
    nuAddBrowseTitleSelect(3, getAccessLevel()); 
    nuAddBrowseTitleSelect(4, getLanguage()); 
    nuAddBrowseTitleSelect(6, getPosition()); 
    nuAddBrowseTitleSelect(7, getDepartment()); 
    nuAddBrowseTitleSelect(8, getTeam()); 
    $("select[id^='nuBrowseTitle']").parent().unbind("touchstart");
});