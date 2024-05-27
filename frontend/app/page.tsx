"use client";

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { AxiosResponse } from "axios";
import { IResponseData, api } from "@/src/api";

export default function Page() {
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    async function checkToken() {
      let token: string = "";
      if (typeof window !== "undefined")
        token = localStorage.getItem("token") ?? "";

      const response: AxiosResponse<IResponseData> = await api.get("/home", {
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
    if (isAuthorized) {
      redirect("/home");
    }
  }, [isAuthorized]);

  return (
    <div>
      <h1>Page</h1>
      <p>Welcome to the page!</p>
      <Link href="/auth/login">Login</Link>
    </div>
  );
}
