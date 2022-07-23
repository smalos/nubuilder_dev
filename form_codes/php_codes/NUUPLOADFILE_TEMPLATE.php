// Allowed file extensions
$allowed = array('png', 'jpg', 'jpeg', 'pdf', 'xlsx', 'docx');

// Maximum file size
$maxfilesize = 5 * 1024 * 1024; // (5 MB)

$filename = nuSanitizeFilename(basename($_FILES['file']['name']));
$target_dir = $_SERVER['DOCUMENT_ROOT']. '/';
$target_file = $target_dir . $filename;

$error = nuTranslate('Sorry, there was an error uploading your file.');

$ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
if (!in_array($ext, $allowed)) {
    $data = ['error' => $error,
        'message' => 'Invalid File Type'];
    $result = json_encode($data);
}

$filesize = $_FILES["file"]["size"];

if ($filesize > $maxfilesize) {
    $data = ['error' => $error,
        'message' => 'File size exceeded'];
    $result = json_encode($data);
}

try {
    if (move_uploaded_file($_FILES['file']['tmp_name'], $target_file)) {
        $data = ['url' => $target_file,
            'file' => $filename,
            'message' => 'The file ' . $filename . ' has been uploaded.'];
        http_response_code(201);
        $result = json_encode($data);
    } else {
        throw new Exception('Unable to move the uploaded file to its final location:' . $target_file);
    }

} catch (\Throwable $th) {
    $data = ['message' => $error,
        'error' => $th->getMessage()];
    $result = json_encode($data);
}