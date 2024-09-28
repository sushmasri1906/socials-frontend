import axios from "axios";
import { api } from "../Constants/constants";
import { authTokenState } from "@/State/atoms";
import { useRecoilValue } from "recoil";

// Define a type for the error
type FetchPostsError = {
	message: string;
};

export const usePost = () => {
	const token = useRecoilValue(authTokenState);

	// Fetch all posts for a user by user ID
	const fetchPostsByUserId = async (_id: any) => {
		if (!token) {
			throw new Error("No token provided");
		}

		try {
			const response = await fetch(`${api}/posts/profile`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			return data.posts;
		} catch (error: unknown) {
			// Handle and type the error
			if (error instanceof Error) {
				throw new Error(`Failed to fetch posts: ${error.message}`);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};

	const fetchPostsByOthersUserId = async (id: string) => {
		if (!token) {
			throw new Error("No token provided");
		}

		try {
			const response = await fetch(`${api}/posts/user/${id}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			const data = await response.json();
			return data.posts;
		} catch (error: unknown) {
			// Handle and type the error
			if (error instanceof Error) {
				throw new Error(`Failed to fetch posts: ${error.message}`);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};

	// Fetch all posts (for timeline)
	const fetchAllPosts = async () => {
		if (!token) {
			throw new Error("No token provided");
		}

		try {
			const response = await axios.get(`${api}/posts/all`, {
				headers: {
					Authorization: `Bearer ${token}`,
				},
			});
			return response.data;
		} catch (error: unknown) {
			// Handle and type the error
			if (error instanceof Error) {
				throw new Error(`Failed to fetch posts: ${error.message}`);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};

	// Function to create a post
	const createPost = async (postData: {
		caption: string;
		imageUrl: string;
		location: string;
		taggedUsers?: string[];
	}) => {
		try {
			const response = await fetch(`${api}/posts/create`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify(postData),
			});

			if (!response.ok) {
				throw new Error("Failed to create post");
			}

			return response.json();
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(`Failed to create post: ${error.message}`);
			} else {
				throw new Error("An unknown error occurred");
			}
		}
	};
	return {
		createPost,
		fetchAllPosts,
		fetchPostsByUserId,
		fetchPostsByOthersUserId,
	};
};
