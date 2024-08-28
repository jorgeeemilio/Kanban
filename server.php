<?php
$servername = "localhost";
$username = "adminKanban";
$password = "remoto";
$dbname = "kanban_board";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['action'] === 'addCard') {
        $cardTitle = $_POST['cardTitle'];
        $sql = "INSERT INTO cards (title, status) VALUES ('$cardTitle', 'toDo')";
        if ($conn->query($sql) === TRUE) {
            echo "Tarjeta agregada con éxito";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($_POST['action'] === 'moveCard') {
        $cardTitle = $_POST['cardTitle'];
        $target = $_POST['target'];
        $sql = "UPDATE cards SET status = '$target' WHERE title = '$cardTitle'";
        if ($conn->query($sql) === TRUE) {
            echo "Tarjeta movida con éxito";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($_POST['action'] === 'editCard') {
        $originalTitle = $_POST['originalTitle'];
        $newTitle = $_POST['newTitle'];
        $sql = "UPDATE cards SET title = '$newTitle' WHERE title = '$originalTitle'";
        if ($conn->query($sql) === TRUE) {
            echo "Tarjeta editada con éxito";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($_POST['action'] === 'deleteCard') {
        $cardTitle = $_POST['cardTitle'];
        $sql = "DELETE FROM cards WHERE title = '$cardTitle'";
        if ($conn->query($sql) === TRUE) {
            echo "Tarjeta eliminada con éxito";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    } elseif ($_POST['action'] === 'addSubtask') {
        $cardTitle = $_POST['cardTitle'];
        $subtaskDescription = $_POST['subtaskDescription'];
        $sql = "SELECT id FROM cards WHERE title = '$cardTitle'";
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            $cardId = $result->fetch_assoc()['id'];
            $sql = "INSERT INTO subtasks (card_id, description) VALUES ($cardId, '$subtaskDescription')";
            if ($conn->query($sql) === TRUE) {
                echo "Subtarea agregada con éxito";
            } else {
                echo "Error: " . $sql . "<br>" . $conn->error;
            }
        }
    } elseif ($_POST['action'] === 'toggleSubtask') {
        $subtaskId = $_POST['subtaskId'];
        $completed = $_POST['completed'] === 'true' ? 1 : 0;
        $sql = "UPDATE subtasks SET completed = $completed WHERE id = $subtaskId";
        if ($conn->query($sql) === TRUE) {
            echo "Subtarea actualizada con éxito";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
} elseif ($_GET['action'] === 'loadCards') {
    $sql = "SELECT id, title, status FROM cards";
    $result = $conn->query($sql);

    $cards = [
        'toDo' => [],
        'inProgress' => [],
        'done' => []
    ];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $cardId = $row['id'];
            $subtasksSql = "SELECT id, description, completed FROM subtasks WHERE card_id = $cardId";
            $subtasksResult = $conn->query($subtasksSql);
            $subtasks = [];
            if ($subtasksResult->num_rows > 0) {
                while($subtaskRow = $subtasksResult->fetch_assoc()) {
                    $subtasks[] = $subtaskRow;
                }
            }
            $cards[$row['status']][] = ['title' => $row['title'], 'subtasks' => $subtasks];
        }
    }

    echo json_encode($cards);
}

$conn->close();
?>