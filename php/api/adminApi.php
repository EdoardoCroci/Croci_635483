<?php 
    require_once(dirname(__DIR__)."/classes/Database.php");

    /* Restituisce la lista degli utenti per la sezione admin */
    function getAllUsers() {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("SELECT U.`id`, `username`, if(U.`isBanned` = 1, 'sì', 'no') as isBanned, COUNT(G.`id`) as `totGames`, MAX(`date`) as `lastMatchDate`, `registrationDate` 
                               FROM `Users` U
                               LEFT JOIN `Games` G ON G.`user` = U.`id`
                               WHERE U.`isAdmin` = 0 
                               GROUP BY U.`id`");
        $stmt->execute();
        $res = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $pdo = null;

        //sostituisco i valori null dei giocatori che non hanno giocato alcuna partita
        for($i = 0; $i < count($res); $i++) {
            if(is_null($res[$i]["lastMatchDate"])) {
                $res[$i]["lastMatchDate"] = "-";
            }
        }

        return $res;
    }

    /* Disabilita l'accesso ad un utente */
    function banUser($id) {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("UPDATE `Users` SET `isBanned` = 1 WHERE `Users`.`id` = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $pdo = null;

        return "Utente disabilitato con successo";
    }

    /* Abilita l'accesso ad un utente */
    function unbanUser($id) {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("UPDATE `Users` SET `isBanned` = 0 WHERE `Users`.`id` = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $pdo = null;

        return "Utente abilitato con successo";
    }

    function deleteUser($id) {
        $pdo = (new Database())->getPDO();

        $stmt = $pdo->prepare("DELETE FROM `Users` WHERE `Users`.`id` = :id");
        $stmt->bindParam(":id", $id);
        $stmt->execute();

        $pdo = null;

        return "Utente eliminato con successo";
    }
?>