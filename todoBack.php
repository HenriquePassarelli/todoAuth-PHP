<?php

$DB_path = "./data/";

$str_json = json_decode(file_get_contents('php://input'), true);
$email = isset($str_json["email"]) ? $str_json["email"] : '';
$password = isset($str_json["password"]) ? $str_json["password"] : '';
$name = isset($str_json["name"]) ? $str_json["name"] : '';
$operation = isset($str_json["operation"]) ? $str_json["operation"] : '';
$todoList = isset($str_json["todo"]) ? $str_json["todo"] : [];
$itemId = isset($str_json["itemId"]) ? $str_json["itemId"] : array();
$newContent = isset($str_json["newContent"]) ? $str_json["newContent"] : '';

$mock_DB = array('email' => 'henrique.passarelli@hotmail.com', 'password' => '12345', 'name' => 'henrique');

function folder_name($email)
{
    $emailParts = explode('@', $email);
    $fileName = implode('', explode('.', $emailParts[0]));

    return $fileName;
}

function create_db_file($path, $content, $email)
{
    $fileName = folder_name($email);
    $new_file_path = $path . $fileName . ".json";

    if (file_exists($new_file_path)) {
        echo json_encode(array("status" =>  false));
        exit;
    }

    if (file_exists($path)) {
        $new_file = fopen($new_file_path, "a");

        if (is_readable($new_file_path)) {
            fwrite($new_file, $content);
            fclose($new_file);
        }
        return $content;
    } else {
        echo json_encode(array("status" =>  false));
        exit;
    }
    // fwrite($new_file,$content);
}


if ($operation == "register") {

    $user_data = json_encode(array(
        "email" => $email,
        "password" => $password,
        "name" => $name,
        "activity" => []
    ));


    echo json_encode(array("user" => json_decode(create_db_file($DB_path, $user_data, $email)), "status" => true));

    return;
}

if ($operation == "login") {
    if (empty($email) || empty($password)) {
        echo json_encode(array("status" =>  false));
        header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
        exit;
    } else {
        $fileName = folder_name($email);
        $file_path = $DB_path . $fileName . '.json';

        if (is_readable($file_path)) {
            $file = fopen($file_path, "r");
            $content = json_decode(fread($file, filesize($file_path)));
            fclose($file);

            if ($content->email === $email && $content->password === $password) {
                echo json_encode(array('status' => true, 'user' => $content));
                exit;
            } else {
                echo json_encode(array("status" =>  false));

                header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
                exit;
            }

            exit;
        } else {

            echo json_encode(array("status" =>  false));

            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
            exit;
        }

        return;
    }
}

if ($operation === "newTodo") {

    if (empty($email) || empty($password)) {
        echo json_encode(array("status" =>  $email));
        // echo "oi";
        header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
        exit;
    }
    $fileName = folder_name($email);
    $file_path = $DB_path . $fileName . '.json';

    if (is_readable($file_path)) {
        $file = file_get_contents($file_path);
        $content = json_decode($file);

        if ($content->email === $email && $content->password === $password) {

            $data = $content->activity;

            $data[] =  $todoList;

            $content->activity = $data;

            file_put_contents($file_path, json_encode($content));

            echo json_encode(array('status' => true, 'todo' => json_encode($content)));
            exit;
        } else {
            echo json_encode(array("status" =>  false));

            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
            exit;
        }

        exit;
    } else {

        echo json_encode(array("status" =>  false));

        header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
        exit;
    }

    return;
}

if ($operation === "removeTodo") {

    if (empty($email) || empty($password)) {
        echo json_encode(array("status" =>  $email));
        header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
        exit;
    }
    $fileName = folder_name($email);
    $file_path = $DB_path . $fileName . '.json';

    if (is_readable($file_path)) {
        $file = file_get_contents($file_path);
        $content = json_decode($file);

        if ($content->email === $email && $content->password === $password) {

            $data = $content->activity;

            array_splice($data, $itemId, 1);

            $content->activity = $data;

            file_put_contents($file_path, json_encode($content));

            echo json_encode(array('status' => true, 'todo' => json_encode($content)));
            exit;
        } else {
            echo json_encode(array("status" =>  false));

            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
            exit;
        }

        exit;
    } else {

        echo json_encode(array("status" =>  false));

        header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
        exit;
    }
}

if ($operation === "taskDone") {

    if (empty($email) || empty($password)) {
        echo json_encode(array("status" =>  $email));
        header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
        exit;
    }
    $fileName = folder_name($email);
    $file_path = $DB_path . $fileName . '.json';

    if (is_readable($file_path)) {
        $file = file_get_contents($file_path);
        $content = json_decode($file);

        if ($content->email === $email && $content->password === $password) {

            $data = $content->activity;

            $taskStatus =  $data[$itemId]->status;
            $data[$itemId]->status = !$taskStatus;
            $content->activity = $data;

            file_put_contents($file_path, json_encode($content));

            echo json_encode(array('status' => true, 'todo' => json_encode($content)));
            exit;
        } else {
            echo json_encode(array("status" =>  false));

            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
            exit;
        }

        exit;
    } else {

        echo json_encode(array("status" =>  false));

        header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
        exit;
    }
}

if ($operation === "editTask") {
    if (empty($email) || empty($password)) {
        echo json_encode(array("status" =>  $email));
        header($_SERVER["SERVER_PROTOCOL"] . " 400 Bad Request");
        exit;
    }
    $fileName = folder_name($email);
    $file_path = $DB_path . $fileName . '.json';

    if (is_readable($file_path)) {
        $file = file_get_contents($file_path);
        $content = json_decode($file);

        if ($content->email === $email && $content->password === $password) {

            $data = $content->activity;

            $data[$itemId]-> text = $newContent;
            $content->activity = $data;

            file_put_contents($file_path, json_encode($content));

            echo json_encode(array('status' => true, 'todo' => json_encode($content)));
            exit;
        } else {
            echo json_encode(array("status" =>  false));

            header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
            exit;
        }

        exit;
    } else {

        echo json_encode(array("status" =>  false));

        header($_SERVER["SERVER_PROTOCOL"] . " 401 Unauthorized");
        exit;
    }
}

if ($operation == 'logout') {
    echo json_encode(array('status' => true));
    return;
} else {

    echo json_encode(array('status' => false));
    header($_SERVER["SERVER_PROTOCOL"] . " 404 Not Found");
    exit;
}
