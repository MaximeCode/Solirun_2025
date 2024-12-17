import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import './styles/app.css';

// Vérifie si l'élément avec id 'root' existe
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App page={"home"} />);
}

// Vérifie si l'élément avec id 'classement' existe
const classementElement = document.getElementById('classement');
if (classementElement) {
    const classement = ReactDOM.createRoot(classementElement);
    classement.render(<App page={"Classement"} />);
}
