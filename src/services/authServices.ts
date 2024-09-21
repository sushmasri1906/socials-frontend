import axios from "axios";
import { register, login } from "../Constants/constants";

// Function to handle user registration
export const registerUser = async (userData: any) => {
	try {
		const response = await axios.post(register, userData);
		return response.data;
	} catch (error) {
		console.error("Error registering user:", error);
		throw error;
	}
};

// Function to handle user login
export const loginUser = async (credentials: any) => {
	try {
		const response = await axios.post(login, credentials);
		return response.data;
	} catch (error) {
		console.error("Error logging in user:", error);
		throw error;
	}
};
