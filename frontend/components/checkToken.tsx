import { AxiosResponse } from "axios";
import { IResponseData, api } from "./api";

export async function checkToken() {
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
}
