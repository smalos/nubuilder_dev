<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
http_response_code(400);

header('Content-type: application/json');
header('Content-Type: text/plain; charset=utf-8');

if ($_POST && !empty($_FILES["file"]) && is_uploaded_file($_FILES['file']['tmp_name'])) {

	// Allowed file extensions
	$allowed = array('png','jpg','jpeg','pdf','xlsx','docx');

	// Maximum file size
	$maxfilesize = 5 * 1024 * 1024; // (5 MB)

	$filename = sanitizeFilename(basename($_FILES['file']['name']));
	$target_dir =  $_SERVER['DOCUMENT_ROOT']. '/'; 	
	$target_file = $target_dir . $filename);

	$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
	if (!in_array($ext, $allowed)) {
		$data = ['error' => 'Sorry, there was an error uploading your file.', 'error' => 'Invalid File Type'];
		echo json_encode($data);
	}

	$filesize = $_FILES["file"]["size"];

	if ($filesize > $maxfilesize) {
			$data = ['error' => 'Sorry, there was an error uploading your file.', 'error' => 'File size exceeded'];
			echo json_encode($data);
	}

	try {
		if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
			$data = ['url' => $target_file, 'file' => $filename, 'message' => 'The file ' . $filename . ' has been uploaded.'];
			http_response_code(201);
			echo json_encode($data);
		} else {
			throw new Exception('Unable to move the uploaded file to its final location:' . $target_file);
		}

	} catch (\Throwable $th) {
		$data = ['message' => 'Sorry, there was an error uploading your file.', 'error' => $th->getMessage()];
		echo json_encode($data);
	}

}

function sanitizeFilename($file)
{
	$file = mb_ereg_replace("([^\w\s\d\-_~,;\[\]\(\).])", '', $file);
	return mb_ereg_replace("([\.]{2,})", '', $file);
}

?>