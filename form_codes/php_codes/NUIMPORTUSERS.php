$file = nuGetProperty('NUIMPORTUSERS_file');
$delimiter = nuGetProperty('NUIMPORTUSERS_delimiter');

nuImportUsersFromCSV("../temp/".$file, $delimiter, "\n");
nuProcessImportedUsers();