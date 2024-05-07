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
        console.log(postData);
        const response = await api.post('/auth/register', postData);
        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
        } else {
            console.error(response.data.error);
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
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await api.post('/auth/login', { email, password });

        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
        } else {
            console.error(response.data.error);
        }
    };

    return (
        <div className='login'>
            <h2 className='login-header'>Login</h2>
            <form className='login-container' onSubmit={handleSubmit}>
                <p>
                    <input type='text' placeholder='email' value={email} onChange={e => setEmail(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                </p>
                <p>
                    <input type='submit' value='Login' />
                </p>
            </form>
        </div>
    );
}

function Logout() {
    const handleLogout = () => {
        localStorage.removeItem('token');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

function ModifyPassword() {
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        const response = await api.post('/auth/modifypassword',
            { password, newPassword },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
        } else {
            console.error(response.data.error);
        }
    }
    return (
        <div className='modifypassword'>
            <h2 className='modifypassword-header'>Modify Password</h2>
            <form className='modifypassword-container' onSubmit={handleSubmit}>
                <p>
                    <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='New Password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
                </p>
                <p>
                    <input type='submit' value='Modify Password' />
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
            {Logout()}
            {ModifyPassword()}
        </>
    );
}

export default App;
