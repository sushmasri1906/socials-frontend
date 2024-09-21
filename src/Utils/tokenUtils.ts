// Store token in localStorage
export const saveToken = (token: string) => {
	localStorage.setItem("token", token);
};

//retrieve token from local storage
export const getToken = (): string | null => {
	if (typeof window !== "undefined") {
		return localStorage.getItem("token");
	}
	return null;
};

// Remove token from localStorage
export const removeToken = () => {
	localStorage.removeItem("token");
};
