<?php

require_once('phpmailer/PHPMailerAutoload.php');

$toemails = array();

$toemails[] = array(
	'email' => 'dre@gambet.co', // Your Email Address
	'name' => 'Andre at Gambet' // Your Name
);

// Form Processing Messages
$message_success = 'We have successfully received your message and will get back to you shortly.';

$mail = new PHPMailer();

// If you intend you use SMTP, add your SMTP Code after this Line

if( $_SERVER['REQUEST_METHOD'] == 'POST' ) {
	if( $_POST['cf-email'] != '' ) {

		$name = isset( $_POST['cf-name'] ) ? $_POST['cf-name'] : '';
		$email = isset( $_POST['cf-email'] ) ? $_POST['cf-email'] : '';
		$subject = isset( $_POST['cf-subject'] ) ? $_POST['cf-subject'] : '';
		$message = isset( $_POST['cf-message'] ) ? $_POST['cf-message'] : '';

		$subject = isset($subject) ? $subject : 'New Message From Contact Form';

		$botcheck = $_POST['cf-botcheck'];

		if( $botcheck == '' ) {

			$mail->CharSet = 'UTF-8';
			$mail->SetFrom( $email , $name );
			$mail->AddReplyTo( $email , $name );
			foreach( $toemails as $toemail ) {
				$mail->AddAddress( $toemail['email'] , $toemail['name'] );
			}
			$mail->Subject = $subject;

			$name = isset($name) ? "Name: $name<br><br>" : '';
			$email = isset($email) ? "Email: $email<br><br>" : '';
			$message = isset($message) ? "Message: $message<br><br>" : '';

			$referrer = $_SERVER['HTTP_REFERER'] ? '<br><br><br>This Form was submitted from: ' . $_SERVER['HTTP_REFERER'] : '';

			$body = "$name $email $message $referrer";

			$mail->MsgHTML( $body );
			$sendEmail = $mail->Send();

			if( $sendEmail == true ):
				echo '{ "alert": "success", "message": "' . $message_success . '" }';
			else:
				echo '{ "alert": "error", "message": "Email could not be sent due to some Unexpected Error. Please Try Again later.<br /><br />Reason:<br />' . $mail->ErrorInfo . '" }';
			endif;
		} else {
			echo '{ "alert": "error", "message": "Bot Detected.! Clean yourself Botster.!" }';
		}
	} else {
		echo '{ "alert": "error", "message": "Please Fill up all the Fields and Try Again." }';
	}
} else {
	echo '{ "alert": "error", "message": "An unexpected error occured. Please Try Again later." }';
}

?>