<?php
$host = 'localhost';
$db = 'vacation_saathi';
$user = 'root'; // replace if needed
$pass = '';     // replace if needed

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
