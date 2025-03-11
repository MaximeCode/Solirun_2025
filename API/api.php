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

$action = isset($_GET['action']) ? $_GET['action'] : null;
$data = json_decode(file_get_contents("php://input"), true); // => Array with param in body in JSON

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
  $result = $stmt->get_result();
  $data = $result->fetch_all(MYSQLI_ASSOC); // Récupérer les résultats sous forme de tableau associatif

  // ✅ Forcer $data à être un tableau vide si aucun résultat
  if ($data === null) {
    $data = [];
  }

  http_response_code(200);
  showPettryJson($data); // Afficher un tableau vide [] si aucune donnée

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
        error_log("Classes");
        break;

      case 'NextRuns':
        fetchData("SELECT * FROM NextRuns", $conn);
        break;

      case 'Runs':
        $sql = "SELECT Classes.id AS Classes_id, Classes.name AS Classes_name, Classes.surname AS Classes_surname, Classes.color AS Classes_color, 
          Classes.nbStudents AS Classes_nbStudents, Classes.codeClass AS Classes_codeClass,
          Runners.theClass AS Runners_theClass, Runners.theRun AS Runners_theRun, Runners.laps AS Runners_laps,
          Runs.id AS Runs_id, Runs.startTime AS Runs_startTime, Runs.endTime AS Runs_endTime, Runs.estimatedTime AS Runs_estimatedTime
          FROM Classes 
          INNER JOIN Runners ON Classes.id = Runners.theClass 
          INNER JOIN Runs ON Runs.id = Runners.theRun";
        fetchData($sql, $conn);
        break;

      case 'ClassesRunning':
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
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
    // error_log(print_r($data, true));

    error_log("Action : " . $data['action']);
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

      case 'UpdateLaps':
        if (isset($data['theClass']) && isset($data['theRun']) && isset($data['laps'])) {
          $stmt = $conn->prepare("UPDATE Runners SET laps = ? WHERE theClass = ? AND theRun = ?");
          $stmt->bind_param("iii", $data['laps'], $data['theClass'], $data['theRun']); // "i" pour integer

          if ($stmt->execute()) {
            showPettryJson(["success" => "Le nombre de tours a été mis à jour avec succès"]);
          } else {
            showPettryJson(["error" => "Erreur lors de la mise à jour du nombre de tours : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPettryJson(["error" => "Paramètres manquants (theClass, theRun, laps)"]);
        }
        break;

      case 'insertAllClasses':
        // Vérifier si les données nécessaires sont présentes
        if (isset($data['classes'])) {
          // Begin transaction for atomicity
          $conn->begin_transaction();

          try {
            error_log("Attempting to delete all classes");
            // Delete all classes
            $stmt = $conn->prepare("DELETE FROM Classes");
            if (!$stmt->execute()) {
              throw new Exception("Failed to delete classes: " . $stmt->error);
            }
            error_log("Classes deleted successfully");

            // Insert all new classes
            foreach ($data['classes'] as $class) {
              $stmt = $conn->prepare("INSERT INTO Classes (name, nbStudents, codeClass) VALUES (?, ?, ?)");
              if (!$stmt) {
                throw new Exception("Failed to prepare insert statement: " . $conn->error);
              }

              $codeClass = strtoupper(substr($class['name'], 0, 3)) . substr($class['name'], -1);
              $stmt->bind_param("sis", $class['name'], $class['nbStudents'], $codeClass);

              if (!$stmt->execute()) {
                throw new Exception("Failed to insert class: " . $stmt->error);
              }

              error_log("Inserted class: " . $class['name']);
            }

            // Commit the transaction
            $conn->commit();
            error_log("Classes inserted successfully");
            showPettryJson(["success" => "Classes insérées en DB avec succès"]);
          } catch (Exception $e) {
            // Rollback on error
            $conn->rollback();
            error_log("Error in insertAllClasses: " . $e->getMessage());
            http_response_code(500);
            showPettryJson(["error" => "Erreur lors de l'insertion des classes: " . $e->getMessage()]);
          }
        } else {
          http_response_code(400);
          showPettryJson([
            "error" => "Paramètres manquants pour l'insertion des classes"
          ]);
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
die();
