<?php
define('SECURE_ACCESS', true);
// Inclure le fichier de configuration
$config = require 'config.php';

// Création de la connexion à la base de données
$conn = new mysqli($config['DB_HOST'], $config['DB_USER'], $config['DB_PASSWORD'], $config['DB_NAME'], $config['DB_PORT']);

// Vérifier la connexion
if ($conn->connect_error) {
    die(json_encode(["error" => "Échec de la connexion : " . $conn->connect_error]));
}

// Exemple de requête SQL
$sql = "SELECT * FROM Classes";
$result = $conn->query($sql);

// Stocker les résultats dans un tableau
$data = [];
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

// Retourner le résultat encodé en JSON
header('Content-Type: application/json');
echo json_encode($data);

// Fermer la connexion
$conn->close();
?>