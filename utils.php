<?php
class Database {

  private static function connect() {
    $pdo = new PDO('mysql:host=;dbname=;charset=UTF8', '', '', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

    $pdo->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    return $pdo;
  }

  public static function query($query, $params = array()) {
    $statement = self::connect()->prepare($query);
    $statement->execute($params);

    $data = $statement->fetchAll();

    return $data;
  }

  public static function insertQuery($query, $params = array()) {
    $db = self::connect();
    $statement = $db->prepare($query);
    $statement->execute($params);

    return $db->lastInsertId();
  }
}
?>
