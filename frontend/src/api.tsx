import axios from "axios";

export interface IResponseData {
  ok: boolean;
  data?: {
    token: string;
  };
  message?: string;
  error?: string;
}

export const api = axios.create({
  baseURL: 'http://localhost:8080',
});