import {
	deleteUserById,
	getProfile,
	getUserProfile,
	updateUserProfile,
} from "@/Constants/constants";
import axios from "axios";

// Fetch profile
export const fetchProfile = async (token: string) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		const response = await axios.get(getProfile, config); // Fetches the profile of the user with the specified userId
		return response.data; // Adjusted to match API response structure
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Axios Error:", error.response?.data || error.message);
			throw new Error(
				`Failed to fetch profile: ${
					error.response?.data.message || error.message
				}`
			);
		} else {
			console.error("Unknown Error:", error);
			throw new Error("An unknown error occurred");
		}
	}
};

export const fetchOthersProfile = async (userId: string, token: string) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		const response = await axios.get(getUserProfile(userId), config); // Fetches the profile of the user with the specified userId
		return response.data; // Adjusted to match API response structure
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Axios Error:", error.response?.data || error.message);
			throw new Error(
				`Failed to fetch profile: ${
					error.response?.data.message || error.message
				}`
			);
		} else {
			console.error("Unknown Error:", error);
			throw new Error("An unknown error occurred");
		}
	}
};

// Update profile
export const updateProfile = async (
	userId: string,
	updatedData: { username: string; bio: string },
	token: string
) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		const response = await axios.put(
			updateUserProfile(userId),
			updatedData,
			config
		); // Update the profile of the user with the specified userId
		return response.data; // Adjusted to match API response structure
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Axios Error:", error.response?.data || error.message);
			throw new Error(
				`Failed to update profile: ${
					error.response?.data.message || error.message
				}`
			);
		} else {
			console.error("Unknown Error:", error);
			throw new Error("An unknown error occurred");
		}
	}
};

// Delete profile
export const deleteProfile = async (userId: string, token: string) => {
	const config = {
		headers: { Authorization: `Bearer ${token}` },
	};
	try {
		await axios.delete(deleteUserById(userId), config); // Deletes the profile of the user with the specified userId
		// Assume the API does not return data on successful deletion
		return { message: "Profile deleted successfully" };
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error("Axios Error:", error.response?.data || error.message);
			throw new Error(
				`Failed to delete profile: ${
					error.response?.data.message || error.message
				}`
			);
		} else {
			console.error("Unknown Error:", error);
			throw new Error("An unknown error occurred");
		}
	}
};


