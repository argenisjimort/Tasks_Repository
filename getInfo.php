<?php
Include 'connection.php';
$query = "SELECT * FROM {$tasksTable} ORDER BY E_date;";

if( $result = mysqli_query($conn, $query) ) {
    $data = array();
    foreach( $result as $row ) {
        $data[] = $row;
    }
    echo json_encode( $data );
} else {
    echo mysqli_error( $conn );
}

?>