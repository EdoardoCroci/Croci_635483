<?php 
    require_once(__DIR__."/api/gameApi.php");

    if(!isset($_SESSION))
        session_start();

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case "GET":
            $action = $_GET["action"];
            switch($action) {
                case "getWord": 
                    getNewWord($_GET["characters"]);
                    success();
                    break;
                case "makeTry":
                    $res = compareTry($_GET["word"]);
                    success($res);
                    break;
                case "getLatestGames": 
                    $res = getLatestGames();
                    success($res);
                    break;
                case "getLeaderboard":
                    $res = getLeaderboard();
                    success($res);
                    break;
                default: 
                    break;
            }
            break;

        case "POST":
            //prende i dati della richiesta POST
            $json = file_get_contents('php://input');
            $data = json_decode($json);
            
            $action = $data->action;
            switch ($action) {
                default:
                    http_response_code(400);
                    break;
            }
            break;

        default:
            http_response_code(400);
            break;
    }  

?>