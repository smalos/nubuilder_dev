$file = "#csv_from#";
nuImportUsersFromCSV("../temp/".$file, ";", "\n");
nuProcessImportedUsers();