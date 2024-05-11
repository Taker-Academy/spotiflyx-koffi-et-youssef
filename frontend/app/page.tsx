"use client";

import React from 'react';
import axios from 'axios';
import { Login } from './home/auth/login';
import { Logout, ModifyPassword, DeleteUser } from './home/user';

export interface IResponseData {
    ok: boolean;
    data: {
        token: string;
    };
    message: string;
    error: string;
}

export const api = axios.create({
    baseURL: 'http://localhost:8080'
});

function App() {
    return (
        <>
            {Login()}
            {Logout()}
            {ModifyPassword()}
            {DeleteUser()}
        </>
    );
}

export default App;
