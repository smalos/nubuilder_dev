if (nuFormType() == 'browse') {
            if (!nuIsIframe()) {
                
                $('#nuRECORD').css({'width': '100vw', 'height': '85vh', 'overflow-x': 'auto', 'overflow-y': 'auto' });
                $('#nuBreadcrumbHolder').css({ 'width': '100vw', 'display': 'flex', 'flex': '1', 'flex-flow': 'row wrap' });
                $('#nuActionHolder').css({ 'width': '100vw' });
                 $('.nuBrowseTitle, .nuBrowseTitleMultiline').wrapAll('<div id= "btitle"></div>');
        //adding sticky nuBrowseTitle      
$('#nuRECORD').bind("scroll", function() {
  
       var scrollLeft = $('#nuRECORD') .scrollLeft();
          var scrollTop = $('#nuRECORD').scrollTop();
      
            if (scrollTop >= 0 && scrollLeft >= 0) {
               
                $('#btitle').css({ 'z-index': '95','position': 'fixed', 'left':5-scrollLeft + 'px' });
                $('.nuBrowseTitle').css({'top':'0', 'height':'28px'});
                $('.nuBrowseTitleMultiline ').css({'top':'0', 'height':'48px'});
             
             
           }else{
               $('#btitle').css({ 'z-index': '0','position': 'absolute' });
                $('.nuBrowseTitle,.nuBrowseTitleMultiline ').css({'top':'3px'});
            }
       
           
});       
                
                document.body.style.overflow = 'hidden';
            }
        } else {
            document.body.style.overflow = 'visible';
        }
