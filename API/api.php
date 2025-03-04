<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

define('SECURE_ACCESS', true);

// Inclure le fichier de configuration
$config = require 'config.php';

// Création de la connexion à la base de données
$conn = new mysqli($config['DB_HOST'], $config['DB_USER'], $config['DB_PASSWORD'], $config['DB_NAME'], $config['DB_PORT']);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

// Vérifier si "action" est défini et vaut "Ranking"
if (isset($_GET['action']) && $_GET['action'] === 'Ranking') {
    $sql = "SELECT * FROM Ranking";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Retourner les données en JSON
    header('Content-Type: application/json');
    echo json_encode($data);
}

// Vérifier si "action" est défini et vaut "Classes"
if (isset($_GET['action']) && $_GET['action'] === 'Classes') {
    $sql = "SELECT * FROM Classes";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Retourner les données en JSON
    header('Content-Type: application/json');
    echo json_encode($data);
}

// Vérifier si "action" est défini et vaut "NextRuns"
if (isset($_GET['action']) && $_GET['action'] === 'NextRuns') {
    $sql = "SELECT * FROM NextRuns";
    $result = $conn->query($sql);

    $data = [];
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
    }

    // Retourner les données en JSON
    header('Content-Type: application/json');
    echo json_encode($data);
}

// Fermer la connexion
$conn->close();
?>