<?php

Include 'connection.php';

$title = $_POST['title'];
$description = $_POST['description'];
$date = $_POST['date'];

$query = "INSERT INTO {$tasksTable} (Title,Descrip,E_Date, Is_Finished) VALUES ( '$title','$description','$date', '0' );";

if( mysqli_query( $conn, $query ) ) {
    echo "submited";
} else {
    echo mysqli_error($conn);
}

?>