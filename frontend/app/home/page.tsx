"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { IResponseData, api } from "@/src/api";

export default  function Home() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkToken() {
      let token: string = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") ?? "";
      }

      const response: AxiosResponse<IResponseData> = await api.get("/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.ok) setIsAuthorized(true);
      else setIsAuthorized(false);
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
    </div>
  );
}
