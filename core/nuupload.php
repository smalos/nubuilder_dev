<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
http_response_code(400);

header('Content-type: application/json');
header('Content-Type: text/plain; charset=utf-8');

if ($_POST && !empty($_FILES["file"])) {

	$target_dir =  $_SERVER['DOCUMENT_ROOT']. '/'; 	
	$target_file = $target_dir . basename($_FILES['file']['name']);
	
	try {
		if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
			
			$file = basename($_FILES['file']['name']);
			$data = ['url' => $target_file, 'file' => $file, 'message' => 'The file ' . $file . ' has been uploaded.'];
			http_response_code(201);
			echo json_encode($data);
		} else {
			throw new Exception('Unable to move the uploaded file to its final location:' . $target_file);
		}

	} catch (\Throwable $th) {
		$data = ['message' => 'Sorry, there was an error uploading your file.', 'error' => $th->getMessage()];
		http_response_code(400);
		echo json_encode($data);
	}
}

return;
