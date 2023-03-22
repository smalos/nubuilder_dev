$newPassword = '#new_password#';
$checkPassword = '#check_password#';
$passwordsMatch = $newPassword === $checkPassword;

$err = "";
if (empty($newPassword) || empty($checkPassword)) {
    $err = "Both password fields must be filled in.";
}


if (!$passwordsMatch) {
    $err = "The passwords do not match.";
}

if (!empty($err)) {
    nuDisplayError(nuTranslate($err));
}
