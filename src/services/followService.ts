import { api } from "@/Constants/constants";
import { User } from "@/types/types";

export const fetchFollowers = async (
	userId: string,
	token: string
): Promise<{ followers: User[] }> => {
	const response = await fetch(`${api}/user/followers/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) {
		throw new Error("Failed to fetch followers");
	}
	return await response.json();
};

export const fetchFollowing = async (
	userId: string,
	token: string
): Promise<{ following: User[] }> => {
	const response = await fetch(`${api}/user/following/${userId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	if (!response.ok) {
		throw new Error("Failed to fetch following");
	}

	const data = await response.json();
	return data;
};
