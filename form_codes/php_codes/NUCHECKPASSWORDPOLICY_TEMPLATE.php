
function nuFATick($nok) {

    $icon = $nok == false ? "far fa-check-circle" : "far fa-times-circle";
    $color = $nok == false ? "green" : "red";

    return "&nbsp;&nbsp;<i class='$icon' style='color:$color'></i>&nbsp;&nbsp;";

}

function nuCheckPasswordPolicy() {

    $oldpw = '#old_password#';
    $newpw = '#new_password#';

    $atLeast = nuTranslate("Your New Password must contain at least").":";
    $msg = '';
    $c = 0;

    $check = strlen($newpw) < 8;
    if ($check == true) $c++;
    $msg .= nuFATick($check) . nuTranslate("8 Characters") . "<br>";

    $check = !preg_match("#[0-9]+#", $newpw);
    if ($check == true) $c++;
    $msg .= nuFATick($check) . nuTranslate("1 Number") . "<br>";

    $check = !preg_match("#[A-Z]+#", $newpw);
    if ($check == true) $c++;
    $msg .= nuFATick($check) . nuTranslate("1 Capital Letter") . "<br>";

    $check = !preg_match("#[a-z]+#", $newpw);
    if ($check == true) $c++;
    $msg .= nuFATick($check) . nuTranslate("1 Lowercase Letter") . "<br>";

    $check = !preg_match('/[\'\/~`\!@#\$%\^&\*\(\)_\-\+=\{\}\[\]\|;:"\<\>,\.\?\\\]/', $newpw);
    if ($check == true) $c++;
    $msg .= nuFATick($check) . nuTranslate("1 Special Character") . "<br>";

    if ($msg != $atLeast) $msg = $atLeast . "<br><br>" . $msg;

    if ($newpw === $oldpw) {
        $msg .= "<br>" . nuFATick(true) . nuTranslate("The provided New Password cannot be the same as the Current Password") . "<br>";
        $c++;
    }

    if ($c > 0) {
        nuDisplayError($msg);
        return false;
    }
    else {
        return true;
    }

}

$check = nuCheckPasswordPolicy();

