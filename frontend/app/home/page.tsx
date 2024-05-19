"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { IResponseData, api } from "@/src/api";

export default function Home() {
  const logout = () => {
    console.log("logout");
    localStorage.removeItem("token");
  };

  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    async function checkToken() {
      let token: string = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") ?? "";
      }
      try {
        const response: AxiosResponse<IResponseData> = await api.get("/home", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.ok === true) {
          localStorage.setItem("token", response.data.data.token);
          console.log(response.data.ok);
          setIsAuthorized(true);
        } else setIsAuthorized(false);
      } catch (err) {
        setIsAuthorized(false);
      }
    }

    checkToken();
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      redirect("/auth/login");
    }
  }, [isAuthorized]);

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
