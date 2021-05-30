<?php
Include 'connection.php';
$id = $_POST['id'];
$isFinished = $_POST['isFinished'];

$query = "UPDATE {$tasksTable} SET Is_Finished={$isFinished} WHERE Id={$id};";
if( mysqli_query($conn, $query) ) {
    echo "Updated, Is_Finished={$isFinished}";
} else {
    echo mysqli_error($conn);
}
?>