$getDistinctUserColumnQuery = function($column) {
    return "SELECT DISTINCT `$column` FROM `zzzzsys_user` WHERE IFNULL(`$column`,'') <> '' ORDER BY `$column`";
};

$sqlPosition = function() use ($getDistinctUserColumnQuery) {
    return $getDistinctUserColumnQuery('sus_position');
};

$sqlTeam = function() use ($getDistinctUserColumnQuery) {
    return $getDistinctUserColumnQuery('sus_team');
};

$sqlDepartment = function() use ($getDistinctUserColumnQuery) {
    return $getDistinctUserColumnQuery('sus_department');
};

$sqlLanguage = function() use ($getDistinctUserColumnQuery) {
    return $getDistinctUserColumnQuery('sus_language');
};

$sqlAccessLevel = function() {
    $sql = " SELECT DISTINCT CONCAT(sal_code,' : ',sal_description) FROM `zzzzsys_user`
            INNER JOIN zzzzsys_access ON zzzzsys_access_id = sus_zzzzsys_access_id ORDER BY sal_code ";
    return $sql;
};


$position = nuEncodeQueryRowResults($sqlPosition(), [], ['']);
$team = nuEncodeQueryRowResults($sqlTeam(), [], ['']);
$department = nuEncodeQueryRowResults($sqlDepartment(), [], ['']);
$language = nuEncodeQueryRowResults($sqlLanguage(), [], ['']);
$accessLevel = nuEncodeQueryRowResults($sqlAccessLevel(), [], ['']);

$filterJS = "
    function getData(data) {
        return JSON.parse(atob(data));
    }
    function getPosition() {
        return getData('$position');
    }
    function getTeam() {
        return getData('$team');
    }

    function getDepartment() {
        return getData('$department');
    }
    function getLanguage() {
        return getData('$language');
    }

    function getAccessLevel() {
        return getData('$accessLevel');
    }
";


$addCode = $_SESSION['nubuilder_session_data']['USER_CODE_LABEL'] ?? '';

$addCodeJS = "

    if ('$addCode' !== '') {
        $('#nusort_5').html('$addCode')
    };

";


nuAddJavaScript($filterJS . $addCodeJS);