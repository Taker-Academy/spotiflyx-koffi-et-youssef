"use client";
import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    return false;
  }
};

export default async function Page() {
  const isAuthorized = await checkToken();

  if (isAuthorized) {
    redirect("/home");
  } else {
    redirect("/auth/login");
  }
  return (
    <div>
      <h1>Page</h1>
      <p>Welcome to the page!</p>
      <Link href="/auth/login">Login</Link>
    </div>
  );
}
