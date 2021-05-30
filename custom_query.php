<?php
Include 'connection.php';
$query = $_POST['query'];

if( mysqli_query( $conn, $query ) ) {
    echo $query;
} else {
    echo mysqli_error($conn);
}

?>