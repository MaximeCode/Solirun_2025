<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define('SECURE_ACCESS', true);

header('Content-Type: application/json');

// Inclure le fichier de configuration
$config = require 'config.php';

// Création de la connexion à la base de données
$conn = new mysqli($config['DB_HOST'], $config['DB_USER'], $config['DB_PASSWORD'], $config['DB_NAME'], $config['DB_PORT']);

// Vérifier la connexion
if ($conn->connect_error) {
  die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

$action = $_GET['action'];
$table = $_GET['table'];

// Récupérer les données POST
$input = json_decode(file_get_contents('php://input'), true);
$classId = $input['classId'];
$name = $input['name'];
$nbStudents = $input['nbStudents'];

function showPettryJson($data)
{
  echo json_encode($data, JSON_PRETTY_PRINT);
}

switch ($action) {
  case 'select':
    $sql = "SELECT * FROM $table";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
      while ($row = $result->fetch_assoc()) {
        $data[] = $row;
      }
    }
    showPettryJson($data);
    break;

  case 'update':
    // Vérifier si les données nécessaires sont présentes
    if (isset($classId) && isset($name) && isset($nbStudents)) {
      $classId = $conn->real_escape_string($classId);
      $name = $conn->real_escape_string($name);
      $nbStudents = $conn->real_escape_string($nbStudents);

      $sql = "UPDATE $table SET name = '$name', nbStudents = '$nbStudents' WHERE id = '$classId'";
      if ($conn->query($sql) === TRUE) {
        showPettryJson(["success" => "Classe mise à jour"]);
      } else {
        showPettryJson(["error" => "Erreur lors de la mise à jour de la classe : " . $conn->error]);
      }
    } else {
      showPettryJson([
        "error" => "Paramètres manquants pour la mise à jour de la classe",
        "classId" => $classId,
        "name" => $name,
        "nbStudents" => $nbStudents
      ]);
    }
    break;

  case 'delete':
    // Vérifier si l'ID est présent
    if (isset($classId)) {
      $classId = $conn->real_escape_string($classId);

      $sql = "DELETE FROM Ranking WHERE id = '$classId'";
      if ($conn->query($sql) === TRUE) {
        showPettryJson(["success" => "Enregistrement supprimé"]);
      } else {
        showPettryJson(["error" => "Erreur lors de la suppression: " . $conn->error]);
      }
    } else {
      showPettryJson(["error" => "ID manquant pour la suppression"]);
    }
    break;

  default:
    showPettryJson(["error" => "Action non reconnue. Utilisez 'select', 'update', ou 'delete'"]);
}

// Fermer la connexion
$conn->close();
