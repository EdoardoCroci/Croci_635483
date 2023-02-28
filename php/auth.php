<?php
    require_once(__DIR__."/api/authApi.php");

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case "POST":
            //prende i dati della richiesta POST
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            $action = $data->action;
            switch ($action) {
                case "login":
                    login($data->username, $data->password, $data->rememberMe, $data->admin);
                    break;
                case "register":
                    register($data->username, $data->password);
                    break;
                default:
                    http_response_code(400);
                    break;
            }
            break;
        case "GET": 
            switch ($_GET["action"]) {
                case "logout":
                    logout();
                    break;
                case "checkUserLogged":
                    checkUserLogged($_GET["admin"]);
                    break;
                default: 
                    http_response_code(400);
                    break;
            }
        default:
            http_response_code(400);
            break;
    }   
?>