<?php
    //error reporting
    /* 
        ini_set('display_errors', 1);
        ini_set('display_startup_errors', 1);
        error_reporting(E_ALL);
    */

    require_once(dirname(__DIR__)."/classes/Database.php");
    require_once(__DIR__."/response.php");

    if(!isset($_SESSION)) {
        session_start();
    }

    /* Validità nome utente */
    function checkUsernameAlreadyTaken($username) {
        $pdo = (new Database())->getPDO();

        try {
            $stmt = $pdo->prepare("SELECT U.username
                                   FROM  Users U
                                   WHERE  U.username = :username");
            $stmt->bindParam(":username", $username);
            $stmt->execute();
            $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $pdo = null;

            if (isset($res[0]["username"]))
                return false;
            return true;
        } catch (PDOException $e) {
            $pdo = null;
            return false;
        }
    }

    function checkUsernameValid($username) {
        $pattern = '/^[a-z\d]{4,20}$/i';

        if (!checkUsernameAlreadyTaken($username))
            error("Il nome utente inserito non è disponibile.");
    
        if (!preg_match($pattern, $username))
            error("Nome utente inserito non valido");
    }
?>