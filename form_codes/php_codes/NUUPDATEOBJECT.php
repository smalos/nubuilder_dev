if (nuDemo()) return;

$id = "#NUUPDATEOBJECT_id#";
$value = "#NUUPDATEOBJECT_value#";
$formId = "#NUUPDATEOBJECT_form_id#";
$type = "#NUUPDATEOBJECT_type#";
$column = "#NUUPDATEOBJECT_column#";

if ($type == 'tab') {

    $q = "
            UPDATE `zzzzsys_tab`
            SET $column = ?
            WHERE `zzzzsys_tab_id` = ?
    ";

    nuRunQuery($q, [$value, $id]);

} else if ($type == 'edit') {

    $q = "
        UPDATE `zzzzsys_object`
        SET $column = ?
        WHERE `sob_all_zzzzsys_form_id` = ? AND `sob_all_id` = ?
    ";

    nuRunQuery($q, [$value, $formId, $id]);

} else {

    $q = "
            UPDATE `zzzzsys_browse`
            SET `$column` = ?
            WHERE `sbr_zzzzsys_form_id` = ? AND `sbr_order` = ?
    ";

    nuRunQuery($q, [$value, $formId, $id]);

}