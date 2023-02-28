<?php 
    require_once(dirname(__DIR__)."/classes/Database.php");
    require_once(__DIR__."/response.php");
    
    /* Estrazione parola */
    function getNewWord($characters) {
        if (!isset($characters)){
            error("Errore durante l'estrazione della parola.");
        }

        $_SESSION["nTry"] = 0;

        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("SELECT `word` FROM `Words` WHERE `length` = :length");
        $stmt->bindParam(":length", $characters);
        $stmt->execute();

        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;

        $_SESSION["word"] = $res[rand(0, count($res))]["word"];
    }

    /* Confronto tentativo con parola da indovinare */
    function compareTry($word) {
        //controllo che la parola sia valida
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("SELECT `word` FROM `Words` WHERE `word` = :word");
        $stmt->bindParam(":word", $word);
        $stmt->execute();

        $valid = $stmt->fetch(PDO::FETCH_ASSOC);
        if(!$valid) {
            error("Parola non valida");
        }

        $res = "";
        $_SESSION["nTry"] = $_SESSION["nTry"] + 1;
        $_SESSION["guess"] = $word;

        $toGuess = str_split($_SESSION["word"], 1);

        for ($i = 0; $i < strlen($_SESSION["word"]); $i++) {      
            $pos = array_search($word[$i], $toGuess);

            //0 è interpretato come false, quindi faccio il controllo sul tipo
            if (gettype($pos) == "boolean") {
                $res .= "X"; //carattere assente
            } else {
                if ($_SESSION["word"][$i] == $word[$i]) {
                    $res .= "Y"; //carattere nella posizione giusta
                } else {
                    $res .= "#"; //carattere giusto ma nella posizione sbagliata
                }

                $toGuess[$pos] = "#";
            }
        }
        
        //se sono all'ultimo try e non ha indovinato la parola la restituisco nel messaggio e salvo la partita
        if($_SESSION["nTry"] == 6 && strcmp($res, str_repeat(("Y"), strlen($word))) != 0) {
            $_SESSION["nTry"] += 1;
            saveGame($res);
            $res .= " " . $_SESSION["word"];
        }

        //se ha indovinato la parola salvo la partita
        if(strcmp($res, str_repeat(("Y"), strlen($word))) == 0) {
            saveGame($res);
        }

        return $res;
    }

    /* Aggiunge la partita nel database */
    function saveGame($compare) {
        $pdo = (new Database())->getPDO();

        $points = getGamePoints($_SESSION["nTry"]);

        $stmt = $pdo->prepare("INSERT INTO `Games`(`user`, `correctWord`, `guess`, `points`, `compare`, `date`) 
                               VALUES (:id, :correctWord, :guess, :points, :compare, CURRENT_TIMESTAMP)");
        $stmt->bindParam(":id", $_SESSION["userid"]);
        $stmt->bindParam(":correctWord", $_SESSION["word"]);
        $stmt->bindParam(":guess", $_SESSION["guess"]);
        $stmt->bindParam(":points", $points);
        $stmt->bindParam(":compare", $compare);
        $stmt->execute();

        $pdo = null;
    }

    /* Restituisce il numero di punti prendendo in input il numero del tentativo */
    function getGamePoints($nTry) {
        switch($nTry) {
            case 1: 
                return 6*strlen($_SESSION["word"]);
            case 2: 
                return 5*strlen($_SESSION["word"]); 
            case 3: 
                return 4*strlen($_SESSION["word"]);
            case 4: 
                return 3*strlen($_SESSION["word"]); 
            case 5: 
                return 2*strlen($_SESSION["word"]); 
            case 6: 
                return 1*strlen($_SESSION["word"]);
            default:
                return 0;
        }
    }

    /* Restituisce le ultime 10 partite del giocatore */
    function getLatestGames() {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("SELECT `correctWord`, `guess`, `points`, `compare`, `date`
                               FROM `Games`
                               WHERE `user` = :userid
                               ORDER BY `date` DESC
                               LIMIT 10");

        $stmt->bindParam(":userid", $_SESSION["userid"]);
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;

        return $res;
    }

    /* Restituisce la classifica ordinata per punteggio */
    function getLeaderboard() {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("SELECT `username`, COUNT(G.`id`) as `totGames`, SUM(`points`) as `totPoints`, MAX(`date`) as `lastMatchDate`, `registrationDate` 
                               FROM `Users` U
                               LEFT JOIN `Games` G ON G.`user` = U.`id`
                               WHERE U.`isAdmin` = 0 
                               GROUP BY U.`id`
                               ORDER BY `totPoints` DESC
                               LIMIT 50");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //sostituisco i valori null dei giocatori che non hanno giocato alcuna partita
        for($i = 0; $i < count($res); $i++) {
            if(is_null($res[$i]["totPoints"])) {
                $res[$i]["totPoints"] = 0;
            }
            
            if(is_null($res[$i]["lastMatchDate"])) {
                $res[$i]["lastMatchDate"] = "-";
            }
        }

        $pdo = null;

        return $res;
    }
?>