"use client";
import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export interface IResponseData {
  ok: boolean;
  data: {
    token: string;
  };
  message: string;
  error: string;
}

export const api = axios.create({
  baseURL: "http://localhost:8080",
});

export const checkToken = async () => {
  try {
    const token = localStorage.getItem("token");

    const response: AxiosResponse<IResponseData> = await api.get("/home", {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.ok) return true;
    else return false;
  } catch (error) {
    console.error(error);
    return false;
  }
};

type NavigateFunction = (path: string) => void;

export const navigateBasedOnResponse: (
  navigate: NavigateFunction
) => Promise<void> = async (navigate) => {
  if (!(await checkToken())) navigate("/auth/login");
  else navigate("/home");
};

const Page: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigateBasedOnResponse(navigate);
  }, []);

  return (
    <div>
      <h1>Page</h1>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
      </Routes>
    </Router>
  );
}

export default App;
