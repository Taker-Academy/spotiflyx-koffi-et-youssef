import React, { useState } from 'react';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

function Register() {
    const [email, setEmail] = useState('');
    const [firstName, setfirstName] = useState('');
    const [lastName, setlastName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        const postData = { email, password, firstName, lastName };
        try {
            const response = await api.post('/auth/register', postData);
            console.log('Posted data:', postData);
            console.log('Response data:', response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='register'>
            <h2 className='register-header'>Register</h2>
            <form className='register-container' onSubmit={handleSubmit}>
                <p>
                    <input type='text' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='Confirm Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </p>
                <p>
                    <input type='text' placeholder='firstName' value={firstName} onChange={(e) => setfirstName(e.target.value)} />
                </p>
                <p>
                    <input type='text' placeholder='lastName' value={lastName} onChange={(e) => setlastName(e.target.value)} />
                </p>
                <p>
                    <input type='submit' value='Register' />
                </p>
            </form>
        </div>
    );
}

function Login() {
    return (
        <div className='login'>
            <h2 className='login-header'>Login</h2>
            <form className='login-container'>
                <p>
                    <input type='text' placeholder='email' />
                </p>
                <p>
                    <input type='password' placeholder='Password' />
                </p>
                <p>
                    <input type='submit' value='Login' />
                </p>
            </form>
        </div>
    );
}

function App() {
    return (
        <>
            {Register()}
            {Login()}
        </>
    );
}

export default App;
