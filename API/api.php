<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

define('SECURE_ACCESS', true);

// Inclure le fichier de configuration
$config = require 'config.php';

// Création de la connexion à la base de données
$conn = new mysqli($config['DB_HOST'], $config['DB_USER'], $config['DB_PASSWORD'], $config['DB_NAME'], $config['DB_PORT']);

// Vérifier la connexion
if ($conn->connect_error) {
  die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
  http_response_code(204);
  exit();
}

try {
  // Vérifier si l'action est définie
  if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET['action'])) {
    $action = $_GET['action'];

    switch ($action) {
      case 'Ranking':
        fetchData("SELECT * FROM Ranking", $conn);
        break;

      case 'Classes':
        fetchData("SELECT * FROM Classes", $conn);
        break;

      case 'NextRuns':
        fetchData("SELECT * FROM NextRuns", $conn);
        break;

      case 'ClassesRunning':
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
          fetchData("SELECT Classes.id, Classes.name, Classes.surname AS alias, Classes.color, Classes.nbStudents AS students, Runners.laps FROM Classes INNER JOIN Runners ON Classes.id = Runners.theClass INNER JOIN Runs ON Runs.id = Runners.theRun WHERE Runs.id = ?", $conn, [$id]);
        } else {
          http_response_code(400); // Bad Request
          echo json_encode(["error" => "Paramètre 'id' requis"]);
        }
        break;

      default:
        http_response_code(400); // Bad Request
        echo json_encode(["error" => "Action invalide"]);
        break;
    }
  } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    error_log(print_r($data, true));

    if (isset($data['action']) && $data['action'] === 'StartRun' && isset($data['id'])) {
      $stmt = $conn->prepare("UPDATE Runs SET startTime = NOW() WHERE id = ?");
      $stmt->bind_param("i", $data['id']); // "i" pour integer

      if ($stmt->execute()) {
        echo json_encode(["success" => "La course a été commencée avec succès"]);
      } else {
        echo json_encode(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
      }

      $stmt->close();
    } elseif (isset($data['action']) && $data['action'] === 'EndRun' && isset($data['id'])) {
      $stmt = $conn->prepare("UPDATE Runs SET endTime = NOW() WHERE id = ?");
      $stmt->bind_param("i", $data['id']); // "i" pour integer

      if ($stmt->execute()) {
        echo json_encode(["success" => "La course a été terminée avec succès"]);
      } else {
        echo json_encode(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
      }

      $stmt->close();
    } else {
      http_response_code(400);
      echo json_encode(["error" => "Paramètres manquants"]);
    }
  } else {
    http_response_code(400);
    echo json_encode(["error" => "Requête invalide"]);
  }
} catch (Exception $e) {
  http_response_code(500); // Internal Server Error
  echo json_encode(["error" => "Erreur serveur : " . $e->getMessage()]);
}

function fetchData($sql, $conn, $params = [])
{
  $stmt = $conn->prepare($sql);

  // Vérifier si on a des paramètres à binder
  if (!empty($params)) {
    // Déterminer dynamiquement les types
    $types = "";
    foreach ($params as $param) {
      $types .= is_int($param) ? "i" : "s";
    }
    $stmt->bind_param($types, ...$params);
  }

  $stmt->execute();
  $result = $stmt->get_result();
  $data = $result->fetch_all(MYSQLI_ASSOC);

  if (!empty($data)) {
    http_response_code(200);
    echo json_encode($data);
  } else {
    http_response_code(204); // No Content
    echo json_encode(["message" => "Aucune donnée trouvée"]);
  }

  $stmt->close();
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
