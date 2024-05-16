import { IResponseData, api } from "@/src/api";
import { AxiosResponse } from "axios";

export async function checkToken() {
  let token: string = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") ?? "";
  }

  const response: AxiosResponse<IResponseData> = await api.get("/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.data.ok) return true;
  else return false;
}
