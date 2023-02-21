$addCode = isset($_SESSION['nubuilder_session_data']['USER_CODE_LABEL']) ? $_SESSION['nubuilder_session_data']['USER_CODE_LABEL'] : '';
$j = " if ('$addCode' !== '') { $('#nusort_5').html('$addCode') };";

$sqlPosition = function() {
    $sql = " SELECT DISTINCT `sus_position` FROM `zzzzsys_user` WHERE IFNULL(`sus_position`,'') <> '' ORDER BY `sus_position` ";
    return $sql;
};

$sqlTeam = function() {
    $sql = " SELECT DISTINCT `sus_team` FROM `zzzzsys_user` WHERE IFNULL(`sus_team`,'') <> '' ORDER BY `sus_team` ";
    return $sql;
};

$sqlDepartment = function() {
    $sql = " SELECT DISTINCT `sus_department` FROM `zzzzsys_user` WHERE IFNULL(`sus_department`,'') <> '' ORDER BY `sus_department` ";
    return $sql;
};

$sqlLanguage = function() {
    $sql = " SELECT DISTINCT `sus_language` FROM `zzzzsys_user` WHERE IFNULL(`sus_language`,'') <> '' ORDER BY `sus_language` ";
    return $sql;
};

$sqlAccessLevel = function() {
    $sql = " SELECT DISTINCT CONCAT(sal_code,' : ',sal_description) FROM `zzzzsys_user`
            INNER JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ORDER BY sal_code ";
    return $sql;
};

$getBase64JsonDTString = function($sql) {
    $result = nuRunQuery($sql);
    $a = [];
    $a[] = '';
    while ($row = db_fetch_row($result)) {
        $a[] = $row;
    }
    return base64_encode(json_encode($a));
};

$position = $getBase64JsonDTString($sqlPosition());
$team = $getBase64JsonDTString($sqlTeam());
$department = $getBase64JsonDTString($sqlDepartment());
$language = $getBase64JsonDTString($sqlLanguage());
$accessLevel = $getBase64JsonDTString($sqlAccessLevel());

$js = "

 function getPosition() {
    return JSON.parse(atob('$position'));
 }
 
 function getTeam() {
    return JSON.parse(atob('$team'));
 }

 function getDepartment() {
    return JSON.parse(atob('$department'));
 }
 
 function getLanguage() {
    return JSON.parse(atob('$language'));
 }

 function getAccessLevel() {
    return JSON.parse(atob('$accessLevel'));
 }
   
";

nuAddJavaScript($js . $j);