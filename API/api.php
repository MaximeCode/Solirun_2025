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
          fetchData("SELECT Classes.id, Classes.name, Classes.surname AS alias, Classes.color, Classes.nbStudents AS students, Runners.laps FROM Classes INNER JOIN Runners ON Classes.id = Runners.theClass INNER JOIN Runs ON Runs.id = Runners.theRun WHERE Runs.id = ?", $conn, [$id]);
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

      case 'insertClass':
        if (isset($data['classe'])) {
          $conn->begin_transaction();

          try {
            error_log("Attempting to insert class");
            $stmt = $conn->prepare("INSERT INTO Classes (name, nbStudents, codeClass) VALUES (?, ?, ?)");

            $class = $data["classe"];

            $codeClass = strtoupper(substr($class['name'], 0, 3)) . substr($class['name'], -1);
            $stmt->bind_param("sis", $class['name'], $class['nbStudents'], $codeClass);

            if (!$stmt->execute()) {
              throw new Exception("Failed to insert class: " . $stmt->error);
            }
            error_log("Class inserted successfully ✅");

            // Get the ID of the last inserted run
            $classId = $conn->insert_id;
            error_log("Class ID: $classId");
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in insertClass: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de l'insertion de la classe: " . $e->getMessage()]);
          }
          $conn->commit();
        }
        break;
        case 'updateClass':
          if (isset($data['classe'])) {
              $class = $data["classe"];
              
              // Vérification des données obligatoires
              if (!isset($class['name'], $class['nbStudents'], $class['id'])) {
                  http_response_code(400);
                  showPrettyJson(["error" => "Données manquantes pour la mise à jour de la classe"]);
                  break;
              }
      
              // Sécurisation de l'ID (conversion en entier)
              $class['id'] = (int)$class['id'];
      
              // Génération du codeClass avec sécurité
              if (strlen($class['name']) >= 3) {
                  $codeClass = strtoupper(substr($class['name'], 0, 3)) . substr($class['name'], -1);
              } else {
                  $codeClass = strtoupper($class['name']); // Si trop court, prend tout
              }

              error_log("Classe reçue: " . json_encode($class));
      
              $conn->begin_transaction();
              try {
                  error_log("Attempting to update class");
      
                  $stmt = $conn->prepare("UPDATE Classes SET name = ?, nbStudents = ?, codeClass = ? WHERE id = ?");
                  if (!$stmt) {
                      throw new Exception("Erreur de préparation de la requête: " . $conn->error);
                  }
      
                  $stmt->bind_param("sssi", $class['name'], $class['nbStudents'], $codeClass, $class['id']);
      
                  if (!$stmt->execute()) {
                      throw new Exception("Échec de mise à jour de la classe: " . $stmt->error);
                  }
      
                  error_log("Class updated successfully ✅");
      
                  $stmt->close(); // ✅ Fermeture du statement
                  $conn->commit(); // ✅ Commit après succès
              } catch (Exception $e) {
                  $conn->rollback(); // ✅ Rollback en cas d'erreur
                  error_log("Error in updateClass: " . $e->getMessage());
                  http_response_code(500);
                  showPrettyJson(["error" => "Erreur lors de la mise à jour de la classe: " . $e->getMessage()]);
              }
          } else {
              http_response_code(400);
              showPrettyJson(["error" => "Paramètres manquants pour la mise à jour de la classe"]);
          }
          break;
      case 'deleteClass':
        if (isset($data['classId'])) {
          $conn->begin_transaction();
          try {
            $stmt = $conn->prepare("DELETE FROM Classes WHERE id = ?");

            $stmt->bind_param("i", $data["classId"]);
            if (!$stmt->execute()) {
              throw new Exception("Failed to delete classe: " . $stmt->error);
            }
            error_log("Deleted classe successfully ✅");

            showPrettyJson(["success" => "Classe supprimée avec succès"]);
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in deleteClass: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de la suppression de la classe: " . $e->getMessage()]);
          }
          $conn->commit();
        } else {
          http_response_code(400);
          showPrettyJson(["error" => "Paramètres manquants pour la suppression de la classe"]);
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
        if (isset($data['run_id']) && isset($data['estimatedTime']) && isset($data['class_idToAdd']) && isset($data['class_idToRemove'])) {
          $conn->begin_transaction();
          try {
            error_log("Attempting to update run");
            $stmt = $conn->prepare("UPDATE Runs SET estimatedTime = ? WHERE id = ?");
            $stmt->bind_param("si", $data['estimatedTime'], $data['run_id']);
            if (!$stmt->execute()) {
              throw new Exception("Failed to update run: " . $stmt->error);
            }
            error_log("Run updated successfully ✅");

            // Link to Runners table
            foreach ($data['class_idToAdd'] as $class_id) {
              $stmt = $conn->prepare("INSERT INTO Runners (theClass, theRun) VALUES (?, ?)");
              $stmt->bind_param("ii", $class_id, $data['run_id']);
              if (!$stmt->execute()) {
                throw new Exception("Failed to link class to run: " . $stmt->error);
              }
              error_log("Linked class $class_id to run " . $data['run_id']);
            }

            // Unlink from Runners table
            foreach ($data['class_idToRemove'] as $class_id) {
              $stmt = $conn->prepare("DELETE FROM Runners WHERE theClass = ? AND theRun = ?");
              $stmt->bind_param("ii", $class_id, $data['run_id']);
              if (!$stmt->execute()) {
                throw new Exception("Failed to unlink class from run: " . $stmt->error);
              }
              error_log("Unlinked class $class_id from run " . $data['run_id']);
            }
          } catch (Exception $e) {
            $conn->rollback();
            error_log("Error in updateRun: " . $e->getMessage());
            http_response_code(500);
            showPrettyJson(["error" => "Erreur lors de la mise à jour de la course: " . $e->getMessage()]);
          }
          $conn->commit();
        } else {
          http_response_code(400);
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

      case 'login':
        error_log(json_encode($data));
        if (isset($data['username']) && isset($data['password'])) {
            // Préparation de la requête sécurisée
            error_log(json_encode($data['username']));
            $stmt = $conn->prepare("SELECT id, username, password FROM Logins WHERE username = ?");
            $stmt->bind_param("s", $data['username']);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($result->num_rows === 1) {
                $user = $result->fetch_assoc();
                error_log(json_encode($user));
                
                
                // Vérifier le mot de passe
                if ($data['password'] === $user['password']) {
                  error_log("password good !");
                    // Génération d'un identifiant de session simple
                    $session_token = bin2hex(random_bytes(32));
                    
                    // Stockage du token en base de données
                    $stmt = $conn->prepare("UPDATE Logins SET session_token = ?, last_login = NOW() WHERE id = ?");
                    $stmt->bind_param("si", $session_token, $user['id']);
                    $stmt->execute();
                    
                    showPrettyJson([
                        "success" => true,
                        "message" => "Connexion réussie",
                        "token" => $session_token,
                        "userId" => $user['id'],
                        "username" => $user['username']
                    ]);
                } else {
                    http_response_code(401);
                    showPrettyJson(["error" => "Mot de passe incorrect"]);
                }
            } else {
                http_response_code(401);
                showPrettyJson(["error" => "Utilisateur non trouvé"]);
            }
            
            $stmt->close();
        } else {
            http_response_code(400);
            showPrettyJson(["error" => "Paramètres manquants (username, password)"]);
        }
        break;
      
      case 'verifyToken':
          if (isset($data['token'])) {
            error_log(json_encode($data));
              // Vérifier le token dans la base de données
              $stmt = $conn->prepare("SELECT id, username FROM Logins WHERE session_token = ?");
              $stmt->bind_param("s", $data['token']);
              $stmt->execute();
              $result = $stmt->get_result();
              
              if ($result->num_rows === 1) {
                  $user = $result->fetch_assoc();
                  $response = [
                    "success" => true,
                    "message" => "Token valide",
                    "userId" => $user['id'],
                    "username" => $user['username']
                  ];
                  showPrettyJson($response);
                  error_log(json_encode($response));
              } else {
                  http_response_code(401);
                  showPrettyJson(["error" => "Token invalide ou expiré"]);
              }
              
              $stmt->close();
          } else {
              http_response_code(400);
              showPrettyJson(["error" => "Paramètre 'token' manquant"]);
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