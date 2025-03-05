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

$id = $_GET['id'];
$action = $_GET['action'];
$data = json_decode(file_get_contents("php://input"), true); // => Array

function showPettryJson($data)
{
  echo json_encode($data, JSON_PRETTY_PRINT);
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
  $data = $stmt->get_result()->fetch_all(MYSQLI_ASSOC) ? : [];

  if (!empty($data)) {
    http_response_code(200);
    showPettryJson($data);
  } else {
    http_response_code(204); // No Content
    showPettryJson(["message" => "Aucune donnée trouvée"]);
  }

  $stmt->close();
}

try {
  // Vérifier si l'action est définie
  if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($action)) {

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
          fetchData("SELECT Classes.id, Classes.name, Classes.surname AS alias, Classes.color, Classes.nbStudents AS students, Runners.laps FROM Classes INNER JOIN Runners ON Classes.id = Runners.theClass INNER JOIN Runs ON Runs.id = Runners.theRun WHERE Runs.id = ?", $conn, [$id]);
        } else {
          http_response_code(400); // Bad Request
          showPettryJson(["error" => "Paramètre 'id' requis"]);
        }
        break;

      default:
        http_response_code(400); // Bad Request
        showPettryJson(["error" => "Action invalide"]);
        break;
    }
  } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {
    error_log(print_r($data, true));

    switch ($data['action']) {
      case 'StartRun':
        if (isset($data['id'])) {
          $stmt = $conn->prepare("UPDATE Runs SET startTime = NOW() WHERE id = ?");
          $stmt->bind_param("i", $data['id']); // "i" pour integer

          if ($stmt->execute()) {
            showPettryJson(["success" => "La course a été commencée avec succès"]);
          } else {
            showPettryJson(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPettryJson(["error" => "Paramètres manquants (id)"]);
        }
        break;

      case 'EndRun':
        if (isset($data['id'])) {
          $stmt = $conn->prepare("UPDATE Runs SET endTime = NOW() WHERE id = ?");
          $stmt->bind_param("i", $data['id']); // "i" pour integer

          if ($stmt->execute()) {
            showPettryJson(["success" => "La course a été terminée avec succès"]);
          } else {
            showPettryJson(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPettryJson(["error" => "Paramètres manquants (id)"]);
        }
        break;

      case 'updateClass':
        // Vérifier si les données nécessaires sont présentes
        if (isset($data['classId']) && isset($data['name']) && isset($data['nbStudents'])) {
          $stmt = $conn->prepare("UPDATE $table SET name = :name, nbStudents = :nbStudents WHERE id = :classId");
          $stmt->bind_Param(':name', $data['name']);
          $stmt->bind_Param(':nbStudents', $data['nbStudents']);
          $stmt->bind_Param(':classId', $data['classId']);
          if ($conn->query($sql) === TRUE) {
            showPettryJson(["success" => "Classe mise à jour"]);
          } else {
            showPettryJson(["error" => "Erreur lors de la mise à jour de la classe : " . $conn->error]);
          }
        } else {
          showPettryJson([
            "error" => "Paramètres manquants pour la mise à jour de la classe",
            "classId" => $data['classId'],
            "name" => $data['name'],
            "nbStudents" => $data['nbStudents']
          ]);
        }
        break;

      case 'delete':
        // Vérifier si l'ID est présent
        if (isset($data['classId'])) {
          $stmt = $conn->prepare("DELETE FROM $table WHERE id = :classId");
          $stmt->bind_Param(':classId', $data['classId']);
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
        break;
    }
  } else {
    http_response_code(400);
    showPettryJson(["error" => "Requête invalide"]);
  }
} catch (Exception $e) {
  http_response_code(500); // Internal Server Error
  showPettryJson(["error" => "Erreur serveur : " . $e->getMessage()]);
}

// Fermer la connexion
$conn->close();
