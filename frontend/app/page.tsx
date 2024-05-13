import axios, { AxiosResponse } from "axios";
import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { checkToken } from "@/src/checkToken";

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
