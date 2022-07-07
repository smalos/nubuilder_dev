
function nuGetEmail($adminEmail = '') {
    $u = nuUser();
    $email = $u->sus_email;
    if ($email == null) $email = $adminEmail;
    return $email;
} 

function nuSendCodeByEmail($code) {
    $content = 'Your Code: '.$code;
    $subject = 'nuBuilder Authentication Code';
    $fromName = 'nubuilder';
    $sendTo = nuGetEmail(''); // Pass the globeadmin email address here 
    nuEmailPHP($sendTo, $fromAddress, $fromName, $content, $subject);
    nuDisplayError("An email has been sent to the registered account. Subject = '".subject."'");
}

$command = ! isset($nuauthcommand) ? "#nuauthcommand#" : $nuauthcommand;

$u		= (nuHash()['GLOBAL_ACCESS'] == '1'  ? $_SESSION['nubuilder_session_data']['GLOBEADMIN_NAME'] : nuUser()->zzzzsys_user_id);

if ($command == 'auth_check') {                                                 // Check if the token is valid
    
    $auth2FACheck = $nuAuthCheck(get_defined_vars(), 3600);                     // Token validated less than 1 hour ago

} elseif ($command == 'send') {                                                 // Generate and send the token 
    
    $token = nuGenerateToken(7);                                                // Generate a random string of length 7
    
    nuSet2FAToken($token);                                                      // Store the token in the session
    nuSet2FAVerifiedTime();			
    nuOutput2FATokenToConsole($token);                                          // For testing purposes, output the token to the developer console

    //nuSendCodeByEmail($token);                                                // Send the token by email. 
    
} elseif ($command == 'verify') {                                               // Verify if the entered token is valid

   //  next line is causing an error
     $tokenExpired = nuAuthGetElapsedTime(nuGet2FATokenSentTime($u)) > 300;     // Sent token valid for 5 min (300 s)
  
    if (nuTokenMatches("#auth_code_verify#", $u) && ! $tokenExpired) {          // Entered token matches and token is not expired
        nuSetAuthenticated("#auth_code_verify#");
    } else {
        nuShow2FAAuthenticationError();
    }
    		
}
