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
├── /deploy           # Fichiers ansible
├── package.json      # Dépendances et scripts globaux
└── README.md
```

## ⚙️ Gestion des serveurs avec Ansible

Pour faciliter le démarrage, l'arrêt et la configuration des serveurs API, WebSocket et frontend, ce projet inclut des playbooks Ansible.

### 📂 Emplacement des scripts Ansible

Les fichiers Ansible sont dans le dossier `deploy/` à la racine du projet :

```
/Solirun_2025
  └── deploy/
    ├── solirun_start.yml # Démarrage des serveurs
    ├── solirun_stop.yml # Arrêt des serveurs
    ├── solirun_setup.yml # Configuration initiale
    └── vars.yml # Variables utilisées dans les playbooks
```

### ▶️ Utilisation des playbooks

#### Prérequis

- Ansible installé (`ansible --version`)
- Accès local (les playbooks ciblent `localhost` avec `become: yes`)

#### Mise en place

```bash
sudo ansible-playbook deploy/solirun_setup.yml
```
Ce playbook installe tout le projet avec ses dépandances etc.

#### Lancer les serveurs

```bash
sudo ansible-playbook deploy/solirun_start.yml
```
Ce playbook :

* Vérifie si les ports (API, WebSocket, frontend) sont libres
* Arrête les serveurs s’ils tournent déjà (sécuritaire)
* Lance les serveurs en arrière-plan
* Vérifie que les serveurs écoutent bien sur les bons ports

#### Arrêter les serveurs

```bash
sudo ansible-playbook deploy/solirun_stop.yml
```
Ce playbook arrête proprement les serveurs API, WebSocket et frontend.

### 📝 Personnalisation

* Adapte les ports, chemins et variables dans le fichier deploy/vars.yml pour correspondre à ta configuration.
* Les logs de chaque serveur sont redirigés vers /tmp/ (api.log, ws.log, frontend.log).

Cela facilite la gestion et l’automatisation des serveurs sans manipulations manuelles répétitives.

---

## ⚙️ Installation manuelle

### 💪 Prérequis

* Git
* Node.js (recommandé : version 18.x ou supérieure)
* npm
* PHP 8.3 avec extension `mysqli`
* MariaDB (ou MySQL)

---

### 📄 Installation pas à pas

Clone le dépôt :

```bash
git clone https://github.com/MaximeCode/Solirun_2025
cd Solirun_2025
```

### 📈 1. Installation de la base de données

#### Démarrer le serveur MariaDB/MySQL

Assure-toi que MariaDB ou MySQL est installé et en cours d’exécution.

#### Créer la base de données et l'utilisateur SQL

```bash
mysql -u root -p
```

```sql
CREATE DATABASE IF NOT EXISTS Solirun_2025 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER IF NOT EXISTS 'solirun_user'@'localhost' IDENTIFIED BY 'securepassword123';
GRANT ALL PRIVILEGES ON Solirun_2025.* TO 'solirun_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Importer le dump SQL

```bash
mysql -u solirun_user -p Solirun_2025 < ./sql/solirun_dump.sql
```

### En cas d'erreur d'imporatation du dump

Si l'erreur est en rapport avec la ligne 1 qui ne comprend pas '\\\-', veuillez supprimer la premiere ligne du fichier sql

#### 🔐 Connexion admin par défaut

* **Utilisateur** : `admin`
* **Mot de passe** : `admin`

### 🛠️ 2. Configuration et lancement de l'API

```bash
cd API
```

#### Configuration

Modifie le fichier `/API/config.php` :

```php
<?php

defined('SECURE_ACCESS') or die('Accès direct au fichier non autorisé');

return [
  'DB_HOST' => 'localhost',
  'DB_PORT' => '3306',
  'DB_NAME' => 'Solirun_2025',
  'DB_USER' => 'solirun_user',
  'DB_PASSWORD' => 'securepassword123'
];
```

#### Lancer le serveur API

```bash
php -S localhost:3030
```
ou
```bash
php -S votre_ip:votre_port
```

### 📡 3. Configuration et lancement du serveur WebSocket

```bash
cd NodeServeur
```

#### Configuration

Fichier `/NodeServeur/.env` :

```
PORT=5000
```
ou
```
PORT=votre_port
```

#### Installation des dépendances WebSocket

```bash
npm install
```

#### Lancer le serveur WebSocket

```bash
node server.js
```

Accessible par défaut sur : `http://localhost:5000` ou `http://localhost:votre_port`

### 🌐 4. Configuration et lancement de l'application frontend

#### Installation des dépendances

A la racine du projet :

```bash
npm install
```

#### Configuration

Fichier `/.env` (racine) :

Les adresses a mettre sont celles par rapport au client et non a l'application. `http://localhost:port` n'est utile QUE si on veux acceder depuis la machine où sont lancés les serveurs.

```
NEXT_PUBLIC_API_URL=http://localhost:3030
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```
ou
```
NEXT_PUBLIC_API_URL=http://votre_ip_api:votre_port
NEXT_PUBLIC_SOCKET_URL=http://localhost:votre_port
```

#### Lancer en développement

```bash
npm run dev
```

Accessible par défaut sur : [http://localhost:3000](http://localhost:3000)

#### Lancer en production

```bash
npm run build
npm run start
```

---

### 📌 Scripts personnalisés (facultatif)

Dans `package.json` :

```json
"scripts": {
  "dev": "next dev --turbopack -H 'votre_IP' -p 'votre_port'",
  "build": "next build",
  "start": "next start -H 'votre_IP' -p 'votre_port'",
  "lint": "next lint"
}
```

---

## 📬 Contact

* 📧 [baptiste.vidal@lyceefulbert.fr](mailto:baptiste.vidal@lyceefulbert.fr)
* 📧 [maxime.baude@lyceefulbert.fr](mailto:maxime.baude@lyceefulbert.fr)

---

## 📄 Licence

Ce projet est distribué sous la licence **MIT**.
