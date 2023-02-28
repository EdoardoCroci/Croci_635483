<?php 
    require_once(dirname(__DIR__)."/configuration/credentials.php");

    class Database
    {
        private $pdo;

        //costruttore del database
        function __construct() {
            if ($this->pdo == null) {
                $this->pdo = new PDO(connString, user, password);
            }
        }

        //distruttore del database
        function __destructor() {
            $this->pdo = null;
        }

        public function getPDO() {
            return $this->pdo;
        }
    }
?>