import React, {useEffect, useState} from 'react';

const App = () => {
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetch('/api/hello')
            .then(response => response.json())
            .then(data => setMessage(data.message));
    }, []);

    return (
        <div className="bg-red-500 p-8">
            <h1>Symfony React App</h1>
            <p>{message}</p>
        </div>
    );
};

export default App;