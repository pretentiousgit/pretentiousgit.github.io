<?php

if(!empty($_POST['apname']) && !empty($_POST['apdate'])){
   $apname = $_POST['apname'];
    $apemail = $_POST['apemail'];
    $aptel = $_POST['aptel'];
    $apdate = $_POST['apdate'];
    $apcomment = $_POST['apcomment'];


$to="bobbywebforyou@gmail.com";

$headers = "From: " . $apname . "<". $apemail .">\r\n";
   $message="Name : ".$apname."\n Email : ".$apemail." \n Phone : ".$aptel."\n Date : ".$apdate."\n Message : ".$apcomment;

//send email
$mail=mail($to, "APPOINTMENT", $message , $headers);
    if($mail){
	echo "Email Sent";
	}
	else{
	echo "Email sending failed";

	}
}





else if(!empty($_POST['apfname'])){
   
    $apemail = $_POST['apemail'];
    $aptel = $_POST['aptel'];
    $apdate = $_POST['apdate'];
    $apcomment = $_POST['apcomment'];

$apfname=$_POST['apfname'];
$aplname=$_POST['aplname'];
$apdob=$_POST['apdob'];
$country_id=$_POST['country_id'];
$check1=$_POST['check'];


$to="bobbywebforyou@gmail.com";

$headers = "From: " . $apname . "<". $apemail .">\r\n";

$message="First name : ".$apfname."\n Last name : ".$aplname."\n Date of birth : ". $apdob. "\n Email : ".$apemail." \n Phone : ".$aptel."\n Appointment date : ".$apdate."\n Gender : ". $check1."\n Department : ".$country_id." \n Message : ".$apcomment;

//send email
$mail=mail($to, "APPOINTMENT", $message , $headers);
    if($mail){
	echo "Email Sent";
	}
	else{
	echo "Email sending failed";

	}
}


else if(empty($_POST['apdate']) && !empty($_POST['apemail'])){
   $apname = $_POST['apname'];
    $apemail = $_POST['apemail'];
    $aptel = $_POST['aptel'];
    $apcomment = $_POST['apcomment'];


$to="bobbywebforyou@gmail.com";
$headers = "From: " . $apname . "<". $apemail .">\r\n";
   $message="Name : ".$apname."\n Email : ".$apemail." \n Phone : ".$aptel."\n Message : ".$apcomment;

//send email
$mail=mail($to, "New Message", $message , $headers);
    if($mail){
	echo "Email Sent";
	}
	else{
	echo "Email sending failed";

	}
}




?>
