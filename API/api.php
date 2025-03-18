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

function showPrettyJson($data)
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
  showPrettyJson($data); // Afficher un tableau vide [] si aucune donnée

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
        fetchData("SELECT * FROM NextRuns", $conn); // View
        break;

      case 'AllRuns':
        $sql = "SELECT * FROM AllRuns"; // View which return estimatedTime, classIdList, classNameList
        fetchData($sql, $conn);
        break;

      case 'ClassesRunning':
        if (isset($_GET['id'])) {
          $id = $_GET['id'];
          fetchData("SELECT Classes.id, Classes.name, Classes.color, Classes.nbStudents AS students, Runners.laps FROM Classes INNER JOIN Runners ON Classes.id = Runners.theClass INNER JOIN Runs ON Runs.id = Runners.theRun WHERE Runs.id = ?", $conn, [$id]);
        } else {
          http_response_code(400); // Bad Request
          showPrettyJson(["error" => "Paramètre 'id' requis"]);
        }
        break;

      default:
        http_response_code(400); // Bad Request
        showPrettyJson(["error" => "Action invalide"]);
        break;
    }
  } elseif ($_SERVER["REQUEST_METHOD"] === "POST") {

    error_log("Action : " . $data['action']);
    switch ($data['action']) {
      case 'StartRun':
        if (isset($data['id'])) {
          $stmt = $conn->prepare("UPDATE Runs SET startTime = NOW() WHERE id = ?");
          $stmt->bind_param("i", $data['id']); // "i" pour integer

          if ($stmt->execute()) {
            showPrettyJson(["success" => "La course a été commencée avec succès"]);
          } else {
            showPrettyJson(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPrettyJson(["error" => "Paramètres manquants (id)"]);
        }
        break;

      case 'EndRun':
        if (isset($data['id'])) {
          $stmt = $conn->prepare("UPDATE Runs SET endTime = NOW() WHERE id = ?");
          $stmt->bind_param("i", $data['id']); // "i" pour integer

          if ($stmt->execute()) {
            showPrettyJson(["success" => "La course a été terminée avec succès"]);
          } else {
            showPrettyJson(["error" => "Erreur lors de l'arrêt de la course : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPrettyJson(["error" => "Paramètres manquants (id)"]);
        }
        break;

      case 'UpdateLaps':
        if (isset($data['theClass']) && isset($data['theRun']) && isset($data['laps'])) {
          $stmt = $conn->prepare("UPDATE Runners SET laps = ? WHERE theClass = ? AND theRun = ?");
          $stmt->bind_param("iii", $data['laps'], $data['theClass'], $data['theRun']); // "i" pour integer

          if ($stmt->execute()) {
            showPrettyJson(["success" => "Le nombre de tours a été mis à jour avec succès"]);
          } else {
            showPrettyJson(["error" => "Erreur lors de la mise à jour du nombre de tours : " . $stmt->error]);
          }

          $stmt->close();
        } else {
          http_response_code(400);
          showPrettyJson(["error" => "Paramètres manquants (theClass, theRun, laps)"]);
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
            showPrettyJson(["success" => "Classes insérées en DB avec succès"]);
          } catch (Exception $e) {
            // Rollback on error
            $conn->rollback();
            error_log("Error in insertAllClasses: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de l'insertion des classes: " . $e->getMessage()]);
          }
        } else {
          http_response_code(400);
          showPrettyJson([
            "error" => "Paramètres manquants pour l'insertion des classes"
          ]);
        }
        break;

      case 'insertRun':
        if (isset($data['estimatedTime']) && isset($data['class_idToAdd']) && count($data['class_idToAdd']) > 0) {
          $conn->begin_transaction();
          try {
            error_log("Attempting to insert run");
            $stmt = $conn->prepare("INSERT INTO Runs (estimatedTime) VALUES (?)");
            $stmt->bind_param("s", $data['estimatedTime']);
            if (!$stmt->execute()) {
              throw new Exception("Failed to insert run: " . $stmt->error);
            }
            error_log("Run inserted successfully ✅");

            // Get the ID of the last inserted run
            $runId = $conn->insert_id;
            error_log("Run ID: $runId");

            // Link to Runners table
            foreach ($data['class_idToAdd'] as $class_id) {
              $stmt = $conn->prepare("INSERT INTO Runners (theClass, theRun) VALUES (?, ?)");
              $stmt->bind_param("ii", $class_id, $runId);
              if (!$stmt->execute()) {
                throw new Exception("Failed to link class to run: " . $stmt->error);
              }
              error_log("Linked class $class_id to run " . $runId);
            }
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in insertRun: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de l'insertion de la course: " . $e->getMessage()]);
          }
          $conn->commit();
        }
        break;

      case 'updateRun':
        if (isset($data['run_id']) && isset($data['estimatedTime']) && isset($data['newListId']) && isset($data['oldListId'])) {
          error_log("Updating run: " . $data['run_id'] . " with estimated time: " . $data['estimatedTime'] . " and classes to add: " . implode(", ", $data['newListId']) . " and classes to remove: " . implode(", ", $data['oldListId']));
          $conn->begin_transaction();
          try {
            error_log("Attempting to update run");
            $stmt = $conn->prepare("UPDATE Runs SET estimatedTime = ? WHERE id = ?");
            $stmt->bind_param("si", $data['estimatedTime'], $data['run_id']);
            if (!$stmt->execute()) {
              throw new Exception("Failed to update run: " . $stmt->error);
            }
            error_log("Run updated successfully ✅");

            // Unlink to Runners table
            foreach ($data['oldListId'] as $class_id) {
              $stmt = $conn->prepare("DELETE FROM Runners WHERE theClass = ? AND theRun = ?");
              $stmt->bind_param("ii", $class_id, $data['run_id']);
              if (!$stmt->execute()) {
                throw new Exception("Failed to unlink class from run: " . $stmt->error);
              }
              error_log("Unlinked class $class_id from run " . $data['run_id']);
            }

            // Link to Runners table
            foreach ($data['newListId'] as $class_id) {
              $stmt = $conn->prepare("INSERT INTO Runners (theClass, theRun) VALUES (?, ?)");
              $stmt->bind_param("ii", $class_id, $data['run_id']);
              if (!$stmt->execute()) {
                throw new Exception("Failed to link class to run: " . $stmt->error);
              }
              error_log("Linked class $class_id to run " . $data['run_id']);
            }

            showPrettyJson(["success" => "Course mise à jour avec succès"]);
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in updateRun: " . $e->getMessage());
            http_response_code(550);
            showPrettyJson(["error" => "Erreur lors de la mise à jour de la course: " . $e->getMessage()]);
          }
          $conn->commit();
        } else {
          http_response_code(450);
          showPrettyJson(["error" => "Paramètres manquants pour la mise à jour de la course"]);
        }
        break;

      case 'deleteRun':
        if (isset($data['run_id'])) {
          $conn->begin_transaction();
          try {
            $stmt = $conn->prepare("DELETE FROM Runners WHERE theRun = ?");
            $stmt->bind_param("i", $data['run_id']);
            if (!$stmt->execute()) {
              throw new Exception("Failed to delete runners: " . $stmt->error);
            }
            error_log("Deleted runners successfully ✅");

            $stmt = $conn->prepare("DELETE FROM Runs WHERE id = ?");
            $stmt->bind_param("i", $data['run_id']);
            if (!$stmt->execute()) {
              throw new Exception("Failed to delete run: " . $stmt->error);
            }
            error_log("Deleted run successfully");

            showPrettyJson(["success" => "Course supprimée avec succès"]);
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in deleteRun: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de la suppression de la course: " . $e->getMessage()]);
          }
          $conn->commit();
        } else {
          http_response_code(400);
          showPrettyJson(["error" => "Paramètres manquants pour la suppression de la course"]);
        }
        break;

      default:
        showPrettyJson(["error" => "Action non reconnue. Utilisez 'select', 'update', ou 'delete'"]);
        break;
    }
  } else {
    http_response_code(400);
    showPrettyJson(["error" => "Requête invalide"]);
  }
} catch (Exception $e) {
  http_response_code(500); // Internal Server Error
  showPrettyJson(["error" => "Erreur serveur : " . $e->getMessage()]);
}

// Fermer la connexion
$conn->close();
die();
