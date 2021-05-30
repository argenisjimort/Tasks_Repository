<?php

$host = "localhost";
$user = "root";
$pass = "lmfao2002";
$db = "Tasks_Database";

$conn = mysqli_connect( $host, $user, $pass, $db );

if( !$conn ) {
    die( mysqli_connect_error($conn) );
}

$tasksTable = "Tasks";

?>