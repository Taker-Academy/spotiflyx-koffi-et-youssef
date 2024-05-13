"use client";

import React, { useState, FormEvent } from "react";
import { AxiosResponse } from "axios";
import { IResponseData, api } from "@/src/api";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [firstName, setfirstName] = useState<string>("");
  const [lastName, setlastName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    const postData = { email, password, firstName, lastName };
    const response: AxiosResponse<IResponseData> = await api.post(
      "/auth/register",
      postData
    );
    if (response.data.ok === true) {
      localStorage.setItem("token", response.data.data.token);
      console.log(response.data.message);
      router.push("/home");
    } else {
      console.error(response.data.error);
    }
  };

  return (
    <div className="register">
      <h2 className="register-header">Register</h2>
      <form className="register-container" onSubmit={handleSubmit}>
        <p>
          <input
            type="text"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </p>
        <p>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </p>
        <p>
          <input
            type="text"
            placeholder="firstName"
            value={firstName}
            onChange={(e) => setfirstName(e.target.value)}
          />
        </p>
        <p>
          <input
            type="text"
            placeholder="lastName"
            value={lastName}
            onChange={(e) => setlastName(e.target.value)}
          />
        </p>
        <p>
          <input type="submit" value="Register" />
        </p>
      </form>
    </div>
  );
}
