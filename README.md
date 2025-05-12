# 🏃‍♂️ Solirun - Next.js App, API & WebSocket Server

Ce projet est une application complète composée de trois parties principales :

* 🌐 **Next.js App** — Frontend React moderne
* 📡 **WebSocket Server** — Communication en temps réel
* 🛠️ **API Server** — Backend REST (ou GraphQL)

---

## 📁 Structure du projet

```
/Solirun_2025
│
├── /API              # Serveur API (PHP)
├── /NodeServeur      # Serveur WebSocket (Node.js)
├── /                 # Application frontend (Next.js)
├── package.json      # Dépendances et scripts globaux
└── README.md
```

---

## 💪 Prérequis

* Node.js (recommandé : version 18.x ou supérieure)
* npm
* PHP 8.3 avec extensions `mysqli` et `pdo_mysql`
* Un serveur de base de données (MariaDB conseillé) avec ce [fichier de dump 📥](https://raw.githubusercontent.com/MaximeCode/Solirun_2025/main/sql/solirun_dump.sql)

NB : le dump créer la base de données Solirun_2025 avec un jeu de données fonctionel. Les user et password administrateur dans l'appli sont user : 'admin' et password : 'admin'
---

## 🚀 Installation

Clone le dépôt :

```bash
git clone https://github.com/MaximeCode/Solirun_2025
cd Solirun_2025
```

Installe les dépendances :

```bash
# Pour l'application Next.js (racine du projet)
npm install

# Pour le serveur WebSocket
cd NodeServeur
npm install
```

---

## ⚙️ Configuration

Chaque dossier peut contenir un fichier `.env` ou de configuration locale. Voici les exemples recommandés :

### 🔧 WebSocket `.env`

Fichier : `/NodeServeur/.env`

```
PORT=5000
```

### 🔧 API PHP

Fichier : `/API/config.php`

```php
<?php

defined('SECURE_ACCESS') or die('Accès direct au fichier non autorisé');

return [
  'DB_HOST' => 'IP_HOST_DB',
  'DB_PORT' => 'PORT',
  'DB_NAME' => 'NomDeLaBase',
  'DB_USER' => 'NomUtilisateur',
  'DB_PASSWORD' => 'MotDePasse'
];
```

### 🔧 Frontend `.env`

Fichier : `/.env` (à la racine)

```
NEXT_PUBLIC_API_URL=http://votre_api:port
NEXT_PUBLIC_SOCKET_URL=http://votre_websocket:port
```

### 🔧 Scripts personnalisés (facultatif)

Dans `package.json` (racine) :

```json
"scripts": {
  "dev": "next dev --turbopack -H 'votre_IP' -p 'votre_port'",
  "build": "next build",
  "start": "next start -H 'votre_IP' -p 'votre_port'",
  "lint": "next lint"
}
```

---

## ▶️ Démarrage

### 1. Lancer l'API

```bash
cd API
php -S votre_ip:votre_port
```

### 2. Lancer le serveur WebSocket

```bash
cd NodeServeur
node server.js
```

Par défaut, il écoute sur `http://localhost:5000`

### 3. Lancer l'application Next.js

#### En développement :

```bash
cd /
npm run dev
```

Accessible par défaut sur : [http://localhost:3000](http://localhost:3000)

#### En production :

```bash
cd /
npm run build
npm run start
```

---

## 📬 Contact

Pour toute question ou bug :

* 📧 [baptiste.vidal@lyceefulbert.fr](mailto:baptiste.vidal@lyceefulbert.fr)
* 📧 [maxime.baude@lyceefulbert.fr](mailto:maxime.baude@lyceefulbert.fr)

---

## 📄 Licence

Ce projet est distribué sous la licence **MIT**.
