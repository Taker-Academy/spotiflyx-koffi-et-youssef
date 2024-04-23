import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';

function App() {
    const [message, setMessage] = useState('');
    useEffect(() => {
        fetch('http://localhost:8080/')
            .then(response => response.text())
            .then(data => setMessage(data));
    }, []);
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>{message}</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
