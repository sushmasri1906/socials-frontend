"use client";
import React, { useEffect, useState } from "react";
import {
	followUserService,
	unfollowUserService,
	addLike,
	deleteLike,
	addComment,
} from "@/services/UserProfileServices";
import { useRecoilState, useRecoilValue } from "recoil";
import { authTokenState, postsState, userIdState } from "@/State/atoms";
import { useParams } from "next/navigation";
import { fetchOthersProfile } from "@/services/profileServices";

interface UserProfile {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	bio?: string;
	posts: Array<{
		_id: string;
		imageUrl?: string;
		comments: Array<{ user: string; text: string; _id: string }>;
		likes: Array<string>; // User IDs of people who liked the post
	}>;
	followers: string[];
	following: string[];
}

interface Comment {
	_id: string;
	user: string;
	text: string;
}

const UserProfile: React.FC = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	const token = useRecoilValue(authTokenState);
	const { id: targetUserId } = useParams();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isFollowing, setIsFollowing] = useState<boolean>(false);
	const [hovering, setHovering] = useState<boolean>(false);
	const [posts, setPosts] = useRecoilState(postsState);
	const currentUserId = useRecoilValue(userIdState);

	const loadProfile = async () => {
		if (typeof targetUserId === "string" && token) {
			try {
				const data = await fetchOthersProfile(targetUserId, token);
				setProfile(data.user);
				setPosts(data.user.posts);
				setIsFollowing(data.user.followers.includes(currentUserId));
				setError(null);
			} catch (error) {
				setError("Error fetching profile: " + (error as Error).message);
			} finally {
				setLoading(false);
			}
		} else {
			setError("Invalid ID or token");
			setLoading(false);
		}
	};

	useEffect(() => {
		loadProfile();
	}, [targetUserId, token]);

	const handleFollow = async () => {
		if (profile && token) {
			try {
				await followUserService(profile._id, token);
				setIsFollowing(true);
				loadProfile();
			} catch (error) {
				setError("Error following user: " + (error as Error).message);
			}
		}
	};

	const handleUnfollow = async () => {
		if (profile && token) {
			try {
				await unfollowUserService(profile._id, token);
				setIsFollowing(false);
				loadProfile();
			} catch (error) {
				setError("Error unfollowing user: " + (error as Error).message);
			}
		}
	};

	const handleLike = async (postId: string) => {
		console.log("inside handleLike ", postId);
		try {
			await addLike(postId, token as string);

			// Optimistically update the state instead of reloading the entire profile
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? { ...post, likes: [...post.likes, currentUserId] }
						: post
				)
			);
		} catch (error) {
			setError("Error liking post: " + (error as Error).message);
		}
	};

	const handleUnlike = async (postId: string) => {
		try {
			await deleteLike(postId, token as string);

			// Optimistically update the state instead of reloading the entire profile
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								likes: post.likes.filter((id: any) => id !== currentUserId),
						  }
						: post
				)
			);
		} catch (error) {
			setError("Error unliking post: " + (error as Error).message);
		}
	};

	const handleComment = async (postId: string, text: string) => {
		try {
			if (!text.trim()) {
				return;
			}

			await addComment(postId, { text }, token!);

			// Optimistically update the comments in the state
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								comments: [
									...post.comments,
									{ user: currentUserId, text, _id: new Date().toISOString() },
								],
						  }
						: post
				)
			);
		} catch (error) {
			setError("Error adding comment: " + (error as Error).message);
		}
	};

	const followButtonText = () => {
		return isFollowing ? (hovering ? "Unfollow" : "Following") : "Follow";
	};

	if (loading) {
		return <p>Loading profile...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	if (!profile) {
		return <p>No profile found.</p>;
	}

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md">
			{/* Profile Header */}
			<div className="flex items-center">
				<div className="w-28 h-28 rounded-full overflow-hidden">
					<img
						src={profile.profilePicture || "/default-avatar.png"}
						alt="Profile Picture"
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="flex-1 ml-10">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-semibold">{profile.username}</h2>
						<button
							className={`px-4 py-2 text-sm rounded-lg ${
								isFollowing
									? "border border-gray-300"
									: "bg-blue-500 text-white"
							}`}
							onClick={isFollowing ? handleUnfollow : handleFollow}
							onMouseEnter={() => setHovering(true)}
							onMouseLeave={() => setHovering(false)}>
							{followButtonText()}
						</button>
					</div>
					<div className="flex space-x-4 mt-4">
						<div>
							<span className="font-semibold">
								{profile.posts?.length || 0}
							</span>{" "}
							posts
						</div>
						<div>
							<span className="font-semibold">
								{profile.followers?.length || 0}
							</span>{" "}
							followers
						</div>
						<div>
							<span className="font-semibold">
								{profile.following?.length || 0}
							</span>{" "}
							following
						</div>
					</div>
				</div>
			</div>
			<div className="mt-4">
				<p className="font-medium">{profile.bio || "No bio available"}</p>
			</div>
			{/* Posts Section */}
			<div className="grid grid-cols-3 gap-4 mt-10">
				{posts.length > 0 ? (
					posts.map((post) => (
						<div key={post._id} className="relative">
							<img
								src={post.imageUrl || "/default-image.jpg"}
								alt="Post"
								className="w-full h-full object-cover"
							/>
							<div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-between p-2">
								<div className="flex justify-between">
									<span
										onClick={() =>
											post.likes?.includes(currentUserId) ?? false
												? handleUnlike(post._id)
												: handleLike(post._id)
										}>
										❤️ {post.likes?.length || 0}
									</span>

									<span>💬 {post.comments?.length || 0}</span>
								</div>
								<div className="mt-2 text-white">
									{post.comments &&
										post.comments.map((comment: Comment) => (
											<div key={comment._id}>
												<strong>{comment.user}</strong>: {comment.text}
											</div>
										))}
									<div>
										<input
											type="text"
											placeholder="Add a comment..."
											onKeyDown={(e) => {
												if (e.key === "Enter") {
													handleComment(post._id, e.currentTarget.value);
													e.currentTarget.value = "";
												}
											}}
											className="w-full bg-transparent text-white border-none outline-none"
										/>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<p className="col-span-3 text-center">No posts available.</p>
				)}
			</div>
		</div>
	);
};

export default UserProfile;
