import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { authTokenState, userState } from "@/State/atoms"; // Assuming you are using Recoil for state management
import axios from "axios";
// import { User } from "@/types/types";
import { api } from "@/Constants/constants";
import { useRouter } from "next/navigation";

interface Credentials {
	email: string;
	password: string;
}

interface userProfile {
	username: string;
	email: string;
	password: string;
}

export const useAuth = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const [token, setAuthToken] = useRecoilState(authTokenState); // Assuming authTokenState stores the token
	const setUser = useSetRecoilState(userState);
	const [success, setSuccess] = useState<string | null>(null); // Success message state

	// Register function
	const register = async (userData: userProfile) => {
		setError(null);
		try {
			const response = await axios.post(`${api}/auth/register`, userData);
			if (response.data.user) router.push("/login");
		} catch (err) {
			setError("Failed to register. Please try again.");
		}
	};

	// Login function
	const login = async (credentials: Credentials) => {
		setError(null);
		try {
			const response = await axios.post(`${api}/auth/login`, credentials);
			setAuthToken(response.data.token);
			setUser(response.data.user);
			setSuccess("Login successful! Redirecting...");
			router.push("/");
		} catch (err) {
			setError("Failed to log in. Please check your credentials.");
		}
	};

	// Logout function
	const logout = () => {
		setAuthToken(null);
		setUser({
			_id: "",
			username: "",
			email: "",
			profilePicture: "",
			bio: "",
			isFollowing: false,
			followers: [],
			following: [],
			posts: [],
		});
		router.push("/login");
	};

	return { register, login, logout, error, success, token };
};
