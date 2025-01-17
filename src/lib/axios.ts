import { getToken } from "./token";
import axios from "axios";

const API = axios.create({
	baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
	headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use(
	config => {
		const authData = getToken();
		if (authData.token) config.headers["Authorization"] = `Bearer ${authData.token}`;
		return config;
	},
	error => {
		if (!(error instanceof Error)) error = new Error(String(error));
		return Promise.reject(error);
	},
);

export { API };
