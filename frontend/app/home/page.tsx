"use client";

import { redirect, useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import { IResponseData, api } from "@/src/api";

async function checkToken(setIsAuthorized: any) {
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

function logout(router: any) {
  console.log("logout");
  localStorage.removeItem("token");
  router.push("/auth/login");
}

async function submitUrl(url: string, event: FormEvent) {
  event.preventDefault();
  let token: string = "";
  if (typeof window !== "undefined")
    token = localStorage.getItem("token") ?? "";
  const response: AxiosResponse<IResponseData> = await api.post(
    "/home/add",
    { url },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (response.data.ok) {
    console.log(response.data.message);
  } else {
    console.error(response.data.error);
  }
}

export default function Home() {
  const router = useRouter();

  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    checkToken(setIsAuthorized);
  }, []);

  useEffect(() => {
    if (isAuthorized === false) {
      redirect("/auth/login");
    }
  }, [isAuthorized]);

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const [url, setUrl] = useState<string>("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    submitUrl(url, event);
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page!</p>
      <button onClick={() => logout(router)}>Logout</button>
      <button onClick={togglePopup}>Add a Music or a Video</button>
      {showPopup && (
        <div className="overlay">
          <div className="popup">
            <h2>Add a music or a video</h2>
            <form className="urlform" onSubmit={handleSubmit}>
              <input
                type="url"
                placeholder="url"
                value={url}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setUrl(e.target.value)
                }
              />
              <input type="submit" value="url" />
            </form>
            <button onClick={togglePopup}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
