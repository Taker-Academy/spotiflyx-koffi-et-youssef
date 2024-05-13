"use client";

import { IResponseData, api } from "@/src/api";
import { AxiosResponse } from "axios";
import React, { useState, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function Login() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const response: AxiosResponse<IResponseData> = await api.post(
      "/auth/login",
      { email, password }
    );

    if (response.data.ok) {
      localStorage.setItem("token", response.data.data.token);
      console.log(response.data.message);
      router.push("/home");
    } else {
      console.error(response.data.error);
    }
  };

  return (
    <div className="login">
      <h2 className="login-header">Login</h2>
      <form className="login-container" onSubmit={handleSubmit}>
        <p>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
          />
        </p>
        <p>
          <input type="submit" value="Login" />
        </p>
      </form>
      <Link href="/auth/register">Register</Link>
    </div>
  );
}

export default Login;
