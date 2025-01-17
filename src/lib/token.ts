export const setToken = (token: string): void => {
	if (typeof window === "undefined") return;

	const tokenData = { token };

	localStorage.setItem("authData", JSON.stringify(tokenData));
	sessionStorage.setItem("authData", JSON.stringify(tokenData));
};

export const getToken = (): { token: string | null } => {
	if (typeof window === "undefined") return { token: null };

	const authDataStr = localStorage.getItem("authData");
	if (authDataStr) {
		try {
			const authData = JSON.parse(authDataStr);
			return { token: authData.token ?? null };
		} catch (e: unknown) {
			localStorage.removeItem("authData");
			console.error(e);
			return { token: null };
		}
	}

	const sessionAuthDataStr = sessionStorage.getItem("authData");
	if (sessionAuthDataStr) {
		try {
			const authData = JSON.parse(sessionAuthDataStr);
			return { token: authData.token || null };
		} catch (e: unknown) {
			sessionStorage.removeItem("authData");
			console.error(e);
			return { token: null };
		}
	}

	return { token: null };
};

export const removeToken = (): void => {
	if (typeof window === "undefined") return;

	localStorage.removeItem("authData");
	sessionStorage.removeItem("authData");
};
