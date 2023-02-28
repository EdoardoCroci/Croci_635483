<?php 
    require_once(__DIR__."/api/adminApi.php");
    require_once(__DIR__."/api/response.php");
    
    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case "GET": 
            switch ($_GET["action"]) {
                case "getAllUsers":
                    $res = getAllUsers();
                    success($res);
                    break;           
                default: 
                    http_response_code(400);
                    break;
            }
        case "PUT": 
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            switch ($data->action) {
                case "banUser":
                    $res = banUser($data->id);
                    success($res);
                    break;
                case "unbanUser":
                    $res = unbanUser($data->id);
                    success($res);
                    break;
                default: 
                    http_response_code(400);
                    break;
            }
        case "DELETE": 
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            switch ($data->action) {
                case "deleteUser":
                    $res = deleteUser($data->id);
                    success($res);
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