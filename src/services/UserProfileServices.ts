import axios from "axios";
import { api } from "../Constants/constants";
import { User } from "@/types/types";

// Define types for user profile and errors

type FetchProfileError = {
	message: string;
};

// Fetch user profile of the authenticated user
export const fetchProfile = async (token: string): Promise<User> => {
	if (!token) {
		throw new Error("Invalid token");
	}
	try {
		const response = await axios.get(`${api}/user`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		return response.data;
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Handle known Axios error
			const errorMessage = error.response?.data?.message || error.message;
			throw new Error(`Failed to fetch profile: ${errorMessage}`);
		} else if (error instanceof Error) {
			// Handle general JavaScript errors
			throw new Error(`Failed to fetch profile: ${error.message}`);
		} else {
			// Handle unknown errors
			throw new Error("An unknown error occurred");
		}
	}
};

// Follow a user
export const followUserService = async (
	userId: string,
	token: string
): Promise<void> => {
	if (!token || !userId) {
		throw new Error("Invalid token or userId");
	}
	try {
		await axios.post(
			`${api}/user/follow/${userId}`,
			{
				targetUserId: userId,
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Handle known Axios error
			const errorMessage = error.response?.data?.message || error.message;
			throw new Error(`Failed to follow user: ${errorMessage}`);
		} else if (error instanceof Error) {
			// Handle general JavaScript errors
			throw new Error(`Failed to follow user: ${error.message}`);
		} else {
			// Handle unknown errors
			throw new Error("An unknown error occurred");
		}
	}
};

// Unfollow a user
export const unfollowUserService = async (
	userId: string,
	token: string
): Promise<void> => {
	if (!token || !userId) {
		throw new Error("Invalid token or userId");
	}
	try {
		await axios.post(
			`${api}/user/unfollow/${userId}`, // Pass the userId in the URL if required by API
			{
				targetUserId: userId, // Pass the target userId in the request body if required
			},
			{
				headers: {
					Authorization: `Bearer ${token}`,
				},
			}
		);
	} catch (error: unknown) {
		if (axios.isAxiosError(error)) {
			// Handle known Axios error
			const errorMessage = error.response?.data?.message || error.message;
			throw new Error(`Failed to unfollow user: ${errorMessage}`);
		} else if (error instanceof Error) {
			// Handle general JavaScript errors
			throw new Error(`Failed to unfollow user: ${error.message}`);
		} else {
			// Handle unknown errors
			throw new Error("An unknown error occurred");
		}
	}
};

// Define types for the responses
interface LikeResponse {
	success: boolean;
	message?: string;
}

interface Comment {
	_id: string;
	user: string;
	text: string;
}

interface AddCommentResponse {
	success: boolean;
	comment: Comment;
}

interface FetchCommentsResponse {
	success: boolean;
	comments: Comment[];
}

// Add a like to a post
export const addLike = async (
	postId: string,
	token: string
): Promise<LikeResponse> => {
	console.log("inside addLike ", postId);
	const response = await axios.post(
		`${api}/posts/like`,
		{ postId },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

// Delete a like

export const deleteLike = async (
	postId: string,
	token: string
): Promise<LikeResponse> => {
	const response = await axios.delete(`${api}/posts/like/${postId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

export const addComment = async (
	postId: string,
	comment: string,
	token: string
): Promise<{ comment: Comment }> => {
	const response = await axios.post(
		`${api}/posts/comments`,
		{ postId, comment },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

//get comments for post
export const fetchComments = async (
	postId: string,
	token: string
): Promise<FetchCommentsResponse> => {
	const response = await axios.get(`${api}/posts/${postId}/comments`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

//update comment
export const updateComment = async (
	commentId: string,
	commentData: { text: string },
	postId: string,
	token: string
): Promise<LikeResponse> => {
	const response = await axios.put(
		`${api}/posts/comments/${commentId}`,
		{ postId, text: commentData.text },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

// Delete a comment
export const deleteComment = async (
	commentId: string,
	postId: string,
	token: string
): Promise<LikeResponse> => {
	const response = await axios.delete(`${api}/posts/comments/${commentId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
		data: {
			postId,
		},
	});
	return response.data;
};
