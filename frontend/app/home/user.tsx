import { AxiosResponse } from "axios";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { IResponseData, api } from '../page';

export function Logout() {
    const handleLogout = () => {
        localStorage.removeItem('token');
        console.log('Logged out');
    };

    return (
        <button onClick={handleLogout}>Logout</button>
    );
}
export function ModifyPassword() {
    const [password, setPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();

        const token = localStorage.getItem('token');

        const response: AxiosResponse<IResponseData> = await api.put('/auth/modifypassword',
            { password, newPassword },
            { headers: { 'Authorization': `Bearer ${token}` } }
        );

        if (response.data.ok) {
            localStorage.setItem('token', response.data.data.token);
            console.log(response.data.message);
        } else {
            console.error(response.data.error);
        }
    };

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
export function DeleteUser() {
    const handleDelete = async () => {
        const token = localStorage.getItem('token');

        const response: AxiosResponse<IResponseData> = await api.delete('/auth/delete',
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
