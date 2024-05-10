import React, { useState, FormEvent, ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';

interface IResponseData {
    ok: boolean;
    data: {
        token: string;
    };
    message: string;
    error: string;
}

const api = axios.create({
    baseURL: 'http://localhost:8080'
});

function Register() {
    const [email, setEmail] = useState<string>('');
    const [firstName, setfirstName] = useState<string>('');
    const [lastName, setlastName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match");
            return;
        }
        const postData = { email, password, firstName, lastName };
        const response: AxiosResponse<IResponseData> = await api.post('/auth/register', postData);
        if (response.data.ok === true) {
            localStorage.setItem('token', response.data.data.token);
            console.log(response.data.message);
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
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const response: AxiosResponse<IResponseData> = await api.post('/auth/login', { email, password });

        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
            console.log(response.data.message);
        } else {
            console.error(response.data.error);
        }
    };

    return (
        <div className='login'>
            <h2 className='login-header'>Login</h2>
            <form className='login-container' onSubmit={handleSubmit}>
                <p>
                    <input type='text' placeholder='email' value={email} onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='Password' value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
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
        console.log('Logged out');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}

function ModifyPassword() {
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        const response: AxiosResponse<IResponseData> = await api.post('/auth/modifypassword',
            { password, newPassword },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
            console.log(response.data.message);
        } else {
            console.error(response.data.error);
        }
    }

    return (
        <div className='modifypassword'>
            <h2 className='modifypassword-header'>Modify Password</h2>
            <form className='modifypassword-container' onSubmit={handleSubmit}>
                <p>
                    <input type='password' placeholder='Password' value={password} onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
                </p>
                <p>
                    <input type='password' placeholder='New Password' value={newPassword} onChange={(e: ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)} />
                </p>
                <p>
                    <input type='submit' value='Modify Password' />
                </p>
            </form>
        </div>
    );
}

function DeleteUser() {
    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        const response: AxiosResponse<IResponseData> = await api.post('/auth/delete',
            {},
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.ok) {
            localStorage.removeItem('token');
            console.log(response.data.message);
        } else {
            console.error(response.data.error);
        }
    };

    return (
        <button onClick={handleDelete}>Delete User</button>
    );
}

function App() {
    return (
        <>
            {Register()}
            {Login()}
            {Logout()}
            {ModifyPassword()}
            {DeleteUser()}
        </>
    );
}

export default App;