import axios from "axios";
import { followUser, getProfile, unfollowUser } from "../Constants/constants";

// Define types for user profile and errors
type UserProfile = {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	bio?: string; // Make bio optional in case it's not always provided
	followers: string[];
	following: string[];
	posts: string[];
	postsCount?: number;
	followersCount?: number;
	followingCount?: number;
};

type FetchProfileError = {
	message: string;
};

// Fetch user profile of the authenticated user
export const fetchProfile = async (token: string): Promise<UserProfile> => {
	if (!token) {
		throw new Error("Invalid token");
	}
	try {
		const response = await axios.get(getProfile, {
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
	id: string,
	token: string
): Promise<void> => {
	if (!token || !id) {
		throw new Error("Invalid token or userId");
	}
	try {
		await axios.post(
			followUser(id),
			{
				targetUserId: id,
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
			unfollowUser(userId), // Pass the userId in the URL if required by API
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
		"/ig/posts/like",
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
	likeId: string,
	token: string
): Promise<LikeResponse> => {
	const response = await axios.delete(`/ig/posts/like/${likeId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

// Add a comment
export const addComment = async (
	postId: string,
	commentData: { text: string },
	token: string
): Promise<AddCommentResponse> => {
	const response = await axios.post(
		"/ig/posts/comments",
		{ postId, ...commentData },
		{
			headers: {
				Authorization: `Bearer ${token}`,
			},
		}
	);
	return response.data;
};

// Get comments for a post
export const fetchComments = async (
	postId: string,
	token: string
): Promise<FetchCommentsResponse> => {
	const response = await axios.get(`/ig/posts/${postId}/comments`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};

// Update a comment
export const updateComment = async (
	commentId: string,
	commentData: { text: string },
	token: string
): Promise<LikeResponse> => {
	const response = await axios.put(
		`/ig/posts/comments/${commentId}`,
		commentData,
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
	token: string
): Promise<LikeResponse> => {
	const response = await axios.delete(`/ig/posts/comments/${commentId}`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	return response.data;
};
