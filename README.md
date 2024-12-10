# Symfony React Project Structure

## Project Setup

1. Create a new Symfony project:
```bash
composer create-project symfony/skeleton symfony-react-app
cd symfony-react-app
```

2. Install necessary Symfony packages:
```bash
composer require webapp
composer require symfony/webpack-encore-bundle
```

3. Set up React:
```bash
npm install react react-dom prop-types
npm install @babel/preset-react --save-dev
```

## Project Directory Structure
```
symfony-react-app/
│
├── assets/                 # React frontend sources
│   ├── app.js              # Main React entry point
│   ├── components/         # React components
│   │   └── App.jsx
│   └── styles/             # CSS or SCSS files
│
├── config/
│   └── packages/
│       └── webpack_encore.yaml
│
├── public/
│   └── index.php           # Symfony entry point
│   └── build/              # Webpack-generated assets
│
├── src/
│   ├── Controller/         # Symfony backend controllers
│   │   └── HomeController.php
│   └── ...
│
├── templates/
│   └── base.html.twig      # Main Twig template
│
├── webpack.config.js       # Webpack configuration
├── package.json
└── composer.json
```

## Webpack Configuration (webpack.config.js)
```javascript
const Encore = require('@symfony/webpack-encore');

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .enableSingleRuntimeChunk()
    .enableReactPreset()
    .enableSassLoader()
    .enableSourceMaps(Encore.isDevServer())
    .cleanupOutputBeforeBuild();

module.exports = Encore.getWebpackConfig();
```

## React Entry Point (assets/app.js)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/app.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
```

## React Component (assets/components/App.jsx)
```jsx
import React, { useState, useEffect } from 'react';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello')
            .then(response => response.json())
            .then(data => setMessage(data.message));
    }, []);

    return (
        <div>
            <h1>Symfony React App</h1>
            <p>{message}</p>
        </div>
    );
};

export default App;
```

## Symfony Controller (src/Controller/HomeController.php)
```php
<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home')]
    public function index()
    {
        return $this->render('base.html.twig');
    }

    #[Route('/api/hello', name: 'api_hello')]
    public function hello(): JsonResponse
    {
        return $this->json([
            'message' => 'Hello from Symfony!'
        ]);
    }
}
```

## Main Twig Template (templates/base.html.twig)
```twig
<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title>Symfony React App</title>
        {% block stylesheets %}
            {{ encore_entry_link_tags('app') }}
        {% endblock %}
    </head>
    <body>
        <div id="root"></div>
        {% block javascripts %}
            {{ encore_entry_script_tags('app') }}
        {% endblock %}
    </body>
</html>
```

## Running the Project
```bash
# Install dependencies
npm install
composer install

# Build assets
npm run dev

# Start Symfony server
symfony server:start
```

## Key Integration Points
1. Webpack Encore bridges Symfony and frontend assets
2. React renders in a root div defined in Twig template
3. Symfony provides API endpoints
4. Frontend fetches data from Symfony backend routes
