import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IResponseData, api, checkToken } from "@/app/page";

type NavigateFunction = (path: string) => void;

export const navigateBasedOnResponse: (navigate: NavigateFunction) => Promise<void> = async (navigate) => {
    if (!checkToken())
        navigate("/auth/login");
}

export function Home() {
  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
    </div>
  );
}
