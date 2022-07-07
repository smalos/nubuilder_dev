if (nuDemo()) return;

$csvTransfer = '#csv_transfer#';

if ($csvTransfer == 'export') {
    nuToCSV('#csv_from#', '#csv_to#', '#csv_delimiter#');
} else if ($csvTransfer == 'import') {
    nuFromCSV('#csv_from#', '#csv_to#', '#csv_delimiter#', '#csv_delete_after_import#');
}