<?php 
    require_once(dirname(__DIR__)."/classes/Database.php");
    require_once(__DIR__."/functions.php");
    require_once(__DIR__."/response.php");
    
    /* Login utente */
    function login($username, $password, $rememberMe, $admin) {
        if (!isset($username) || !isset($password) || !isset($rememberMe) || !isset($admin)) {
            error("Dati non inseriti correttamente.");
        }

        $pdo = (new Database())->getPDO();

        //recupero la password dal db
        $stmt = $pdo->prepare("SELECT `password` FROM  `Users` WHERE `username` = :username AND `isAdmin` = :isAdmin");
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":isAdmin", $admin);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        //controllo se la password è corretta
        if(!$res || !password_verify($password, $res["password"])) {
            error("Credenziali inserite non corrette");
        }

        //recupero l'id del giocatore
        $stmt = $pdo->prepare("SELECT `id`, `isBanned` FROM  `Users` WHERE `username` = :username");
        $stmt->bindParam(":username", $username);
        $stmt->execute();

        $res = $stmt->fetch(PDO::FETCH_ASSOC);

        if($res["isBanned"]) {
            error("Il tuo account è stato disabilitato");
        }

        $_SESSION["userid"] = $res["id"];

        $expire = time() + 60*60*24;
        if($rememberMe) {
            setcookie("id", $res["id"], ['expires' => $expire, 'SameSite' => "Strict"]); //data di scadenza 1 giorno
        }

        if($admin) {
            setcookie("userType", "admin", ['expires' => $expire, 'SameSite' => "Strict"]); //data di scadenza 1 giorno
        } else {
            setcookie("userType", "player", ['expires' => $expire, 'SameSite' => "Strict"]); //data di scadenza 1 giorno
        }

        success();

        $pdo = null;
    }

    /* Logout */
    function logout() {
        $expire = time() - 3600;

        unset($_COOKIE["id"]);
        setcookie("id", "", ['expires' => $expire, 'SameSite' => "Strict"]);
        unset($_COOKIE["userType"]);
        setcookie("userType", "", ['expires' => $expire, 'SameSite' => "Strict"]);
        success("Logout effettuato");
    }

    /* Controllo se l'utente è loggato e non è bannato */
    function checkUserLogged($admin) {
        if($admin) {
            if(isset($_COOKIE["userType"]) && $_COOKIE["userType"] != "admin") {
                logout();
            }
        } else {
            if(isset($_COOKIE["userType"]) && $_COOKIE["userType"] == "admin") {
                logout();
            }
        }

        if(isset($_COOKIE["id"])) {
            $pdo = (new Database())->getPDO();
            
            $stmt = $pdo->prepare("SELECT `isBanned` FROM  `Users` WHERE `id` = :id");
            $stmt->bindParam(":id", $_COOKIE["id"]);
            $stmt->execute();

            $res = $stmt->fetch(PDO::FETCH_ASSOC);

            if($res["isBanned"]) {
                error("Il tuo account è stato disabilitato");
            }

            $_SESSION["userid"] = $_COOKIE["id"];

            success("logged");
        }

        success("toLog");
    }

    /* Registrazione nuovo utente */
    function register($username, $password) {
        if (!isset($username) || !isset($password)){
            error("Dati non inseriti correttamente.");
        }

        checkUsernameValid($username);

        $passwordHash = password_hash($password, PASSWORD_BCRYPT);

        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("INSERT INTO `Users` (`username`, `password`, `registrationDate`) 
                               VALUES (:username, :password, CURRENT_TIMESTAMP)");
        $stmt->bindParam(":username", $username);
        $stmt->bindParam(":password", $passwordHash);
        $stmt->execute();
        success();

        $pdo = null;
    }
?>