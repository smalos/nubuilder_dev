$to             = '#ema_to#';
$fromAddress    = '#set_smtp_from_address#';
$fromName       = '#set_smtp_from_name#';
$body           = '#ema_body#';
$subject        = '#ema_subject#';
$bcc            = '#ema_bcc#';
$cc             = '#ema_cc#';
$priority       = '#ema_priority#';

$recipient = ($to == '' && $bcc == '' && $cc == '') ? false : true;

if (! $recipient || $fromAddress == '' || $fromName = '' || $body == '' || $subject == '') {
    showMessage(nuTranslate('Error'), nuTranslate('Required fields cannot be blank.'));
    return;
}

$result = nuSendEmail($to, $fromAddress, $fromName, $body, $subject, [], true, $cc, $bcc, [], $priority);

if (count($result) == 2) {
    showMessage(nuTranslate('Result'), $result[1]);
} else {
    showMessage(nuTranslate('Result'), $result[1].'<br>'.$result[2]);  
}    

function showMessage($title, $msg) {
    nuJavaScriptCallback("nuMessage(['<h2>".$title."</h2><br>" . $msg . "']);");
}