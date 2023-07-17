
function nuWrapInClass(element, element2, classes, containerclass) {

    if (element2) {
        $(element).add(element2).wrapAll('<div class="' + classes + '"></div>');
    } else {
        $(element).wrap('<div  class="' + classes + '"></div>');
    }

    if (containerclass) {
        var $wrapper = $('<div class="' + containerclass + '"></div>');
        $('.' + classes).wrapAll($wrapper);
    }

}

function nuMoveObjectsToGroup(sourceContainerId, targetGroupBoxId, objectIds) {
    // Get the source container element
    var sourceContainer = document.getElementById(sourceContainerId);

    // Get the target group box element
    var targetGroupBox = document.getElementById(targetGroupBoxId);

    // Check if the elements exist
    if (sourceContainer && targetGroupBox) {
        // Convert the objectIds to an array if it's not already
        if (!Array.isArray(objectIds)) {
            objectIds = [objectIds];
        }

        // Move the objects to the target group box
        for (var i = 0; i < objectIds.length; i++) {
            var objectId = objectIds[i];
            var objects = document.querySelectorAll("#" + objectId + "_cid, ." + objectId);

            if (objects.length > 0) {
                objects.forEach(function(object) {
                    targetGroupBox.appendChild(object);
                });
            } else {
                console.log('Object with ID or class "' + objectId + '" not found');
            }
        }
    } else {
        console.log('One or both"'+sourceContainer+'" or"'+targetGroupBox+'" elements not found');
    }
}
//use case of above function
// //// Move objects with ID "myObject" and class "myClass" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", ["myObject", "myClass"]);

// // Move objects with ID "object1" and class "object2" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", ["object1", "object2"]);

// // Move objects with ID "object3" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", "object3");

// // Move objects with class "myClass" to the target group box
// moveObjectsToGroup("sourceContainer", "targetGroupBox", "myClass");


function nuSetGridProperties(targetId, parentId) {
    var targetInput = document.getElementById(targetId);
    var parentDiv = document.getElementById(parentId);
    if (targetInput && parentDiv) {
        parentDiv.style.gridRow = targetInput.style.gridRow;
        parentDiv.style.gridColumn = targetInput.style.gridColumn;
        parentDiv.style.gap = targetInput.style.gap;
        parentDiv.style.justifySelf = targetInput.style.justifySelf;

    }
}

function observeGridChanges(targetId, parentId) {
    var targetInput = document.getElementById(targetId);

    if (!targetInput) return;

    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'style') {
                nuSetGridProperties(targetId, parentId);
            }
        });
    });

    observer.observe(targetInput, {
        attributes: true
    });
}


function addToggle() {

    $('.nuContentBoxTitle').each(function() {
        if (!$(this).text().trim()) {
            $(this).removeClass('nuContentBoxTitle').addClass('nuContentBoxTitle-noText');
        }
    });

    $('.nuContentBoxTitle').click(function() {
        $(this).toggleClass('open');
        $(this).next('.nuContentBoxContainer').find('.nuContentBox,.nuObjectWrapper').toggle("slow");
    });


}

function nuAddTabContentContainer() {
    var $tabs = $('[data-nu-tab]:not([data-nu-form!=""],[data-nu-subform="true"])'); // Get all elements with data-nu-tab attribute :not([data-nu-form!=""]
    var tabContainers = {}; // Create an object to keep track of the tab container elements

    $tabs.each(function (index) {
        var tabIndex = $(this).data('nu-tab'); // Get the value of the data-nu-tab attribute
        //var $tabContent = $('[data-nu-tab="' + tabIndex + '"]'); // Get all elements with the matching data-nu-tab attribute
        var $tabContent = $('[data-nu-tab="' + tabIndex + '"]:not([data-nu-form!=""])'); //:not([data-nu-form!=""]) ,[data-nu-form-id]

        if (!tabContainers[tabIndex]) {
            var $tabContainer = $('<div>').addClass('nuTab-container').attr('data-nu-tab', tabIndex);
            $tabContainer.attr('data-nu-form'); //data-nu-tab //data-tab-index
            var $gridContainer = $('<div>').addClass('nuGrid-container').attr('id', 'nuGrid-Container' + tabIndex);

            $tabContainer.append($gridContainer);
            tabContainers[tabIndex] = $tabContainer;

        }

        tabContainers[tabIndex].find('.nuGrid-container').append($tabContent);


    });

    $.each(tabContainers,
        function (index, container) {
            $('#nuRECORD').append(container); // Append each tab container element to the #nuRECORD element
        });
}

function nuSetTab0Active() {
    var tab0 = document.getElementById('nuTab0');
    var $tabs = $('[data-nu-tab]:not([data-nu-form!=""],[data-nu-subform="true"])');
    //   console.log($tabs);
    if ($tabs) {
        tab0.click();

    }
}

function nuResetElementProperties(ids) {
    $(ids).css({
        'top': '',
        'left': '',
        'width': '',
        'position': '',
        'height': ''
    });
}

function nuWrapElementWithDiv(id, className) {
    var $element = $("#label_" + id+" ,#" + id+", #"+id+"_select2, #"+id+"_file,#"+id+"code, #"+id+"button,#"+id+"description");//, #"+id+"_select2
    var $element2 = $("#"+id+"code, #"+id+"button,#"+id+"description");

    $element.wrapAll('<div id="' + id + '_cid" class="' + className + '"></div>');

    $element2.wrapAll('<div  class="nuLuWrapper"></div>');
    $element2.appendTo(className);
}


function addOddEven(){
    
//     $('.nuObjectWrapper:odd').addClass('odd');
// $('.nuObjectWrapper:even').addClass('even');
$('.nuObjectWrapper:not(.nuRespButton):odd').addClass('odd');
$('.nuObjectWrapper:not(.nuRespButton):even').addClass('even');
}


function nuOnLoad() {
    if (nuFormType() == 'edit') {
        $(document).ready(function() {



            function isResponsive() {

                var f = window.nuFORM.getProperty('form_id');

                if (f !== 'nuhomecompact') {
                    nuSetTab0Active();
                }

                return f.containsAny(['nuaccess', 'nuhomecompact', 'nuuser', '5d0053b54f1df1a', '60ff227479f9950', 'nuselect', '5ca2f87be839e65', '5ca15ca2410c298','5ca123935de96df','5ee831b67f41230']);



            }




            function nuHideInactiveTabContents() {

                $(document).on('click', '.nuTab', function() {
                    var tabIndex = $(this).index();
                    var tabClass = $('#nuTab'+ tabIndex).attr("class");
                    var hasSelectedClass = tabClass.includes('nuTabSelected');
                    if (hasSelectedClass) {
                        $('.nuTab-container').hide();

                        $('.nuTab-container[data-nu-tab="' + tabIndex + '"]').show();

                    }

                });
            }








            if (isResponsive()) {

                nuAddTabContentContainer();


                var frmid = window.nuFORM.getProperty('form_id');

                var o = nuSERVERRESPONSE.objects;
                for (let i = 0; i < o.length; i++) {
                    let id = o[i].id;
                    let oType = o[i].type;

                    nuResetElementProperties("#"+id+",#label_"+id+",#"+id+"_file, .select2, span, .selection,.nuContentBox ");
                    nuResetElementProperties("#"+id+"code,#"+id+"button,#"+id+"description");
                    $("#label_"+id).insertBefore($("#label_"+id).prev());








                    if (oType == 'lookup') {
                        nuWrapElementWithDiv(id, 'nuObjectWrapper  nuLookupWrapper');
                        
                    }

                    if (o[i].input === 'checkbox') {


                       
                        nuWrapElementWithDiv(id, 'nuObjectWrapper  nuResCheckbox');
                        
                    }


                    if (oType == 'file') {


                        
                        nuWrapElementWithDiv(id, 'nuObjectWrapper  nuFileWrapper');
                    }
                    if (o[i].select2 == '1') {


                         //$("#label_"+id+",#"+id+",#"+id+"_select2").wrapAll('<div id="'+id+'_cid" class="nuObjectWrapper nuRespSelect "></div>');//, .select2,[data-select2-id],[data-nu-form-id='nuselect']
                        nuWrapElementWithDiv(id, 'nuObjectWrapper nuRespSelect');
                    }
                    if (o[i].input == 'button' || o[i].type == 'button' || o[i].type == 'run') {


                      
                        nuWrapElementWithDiv(id, 'nuObjectWrapper nuRespButton');

                    }
                    if (oType == 'contentbox') {

                        //to be reviewed
                    }



                    if (oType == 'subform') {

                        
                        nuWrapElementWithDiv(id, 'nuObjectWrapper nuSubformWrapper');
                        
                        $("#"+id).css({
                            'overflow': 'auto'
                        });
                    }

                    if (o[i].read !== '2' && o[i].type !== 'subform' && o[i].type !== 'contentbox' && oType !== 'lookup' && o[i].input !== 'checkbox' && oType !== 'contentbox' && o[i].input !== 'button' && o[i].type !== 'button' && o[i].type !== 'run' && o[i].select2 !== '1') {

                        nuWrapElementWithDiv(id, 'nuObjectWrapper');
                    }

                    nuSetGridProperties(id, id +"_cid");

                }

                $("#user_home,#run_user,edit_php, #menu_procedures, #user_add,#run_access,#run_setup, #menu_setup, #access_add,#form_button, #menu_forms,#object_button,#objects_add,#open_database, #menu_database,#run_filemanager,#run_sql, #sql_add,#run_file, #sql_file,#run_note, #notes_add,#edit_report, #menu_reports,#run_nucodesnippets, #nucodesnippets_add").unwrap();


                nuWrapInClass('#user_home', '', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_user', '#user_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_access', '#access_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#form_button', '#menu_forms', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#object_button', '#objects_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#open_database', '#menu_database', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_setup', '#menu_setup', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_filemanager', '', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_sql', '#sql_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_file', '#sql_file', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_note', '#notes_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#edit_report', '#menu_reports', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_nucodesnippets', '#nucodesnippets_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#edit_php', '#menu_procedures', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuWrapInClass('#run_nuemailtempltates', '#run_nuemailtempltates_add', 'nuHomeRespButton', 'nuHomeButtonWrapper');
                nuMoveObjectsToGroup ('nuGrid-Container0', 'contentbox', 'nuHomeButtonWrapper');


                if (frmid == 'nuuser') {
                    $('.nuRespButton ').unwrap('.nuObjectWrapper');
                    $('#sus_zzzzsys_access_id_open_button').appendTo('.nuLuWrapper');

                    var objectIds = ['sus_name',
                        'sus_zzzzsys_access_id',
                        'sus_login_name',
                        'new_password',
                        'check_password',
                        'sus_language',
                        'sus_password_show_btn','sus_genpass_btn'];
                    var objectIds2 = ['sus_email',
                        'sus_code',
                        'sus_team',
                        'sus_department',
                        'sus_position',
                        'sus_additional1',
                        'sus_additional2',
                        'sus_expires_on'];

                    // Call the function to move the objects
                    nuMoveObjectsToGroup ('nuGrid-Container0', 'contentbox_login', objectIds);
                    nuMoveObjectsToGroup ('nuGrid-Container0', 'contentbox_additional', objectIds2);
                }




                if (frmid == 'nuaccess') {
                    $('.nuRespButton').unwrap('.nuObjectWrapper');
                    $('#sal_zzzzsys_form_id_open_button').appendTo('.nuLuWrapper');
                    var objectIds3 = ['sal_zzzzsys_form_id',
                        'sal_code',
                        'sal_description',
                        'sal_group',
                        'sal_use_2fa',
                    ];

                    nuMoveObjectsToGroup ('nuGrid-Container0', 'contentbox_user', objectIds3);


                }

                nuHideInactiveTabContents();
                addOddEven();
                //addToggle();
                $('div:empty').remove();


            }




          
        });


    }

}

}
