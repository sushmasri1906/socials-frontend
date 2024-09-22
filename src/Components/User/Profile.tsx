"use client";
import React, { useEffect, useState } from "react";
import {
	fetchProfile,
	updateProfile,
	deleteProfile,
} from "@/services/profileServices";
import { useRecoilState } from "recoil";
import { authTokenState, userIdState } from "@/State/atoms";
import { useRouter } from "next/navigation";
import { usePost } from "@/services/usePost";
import { comment } from "postcss";

interface Post {
	_id: string;
	imageUrl?: string;
	user: string;
	caption?: string;

	likes: string[];
	comments: Comment[];
	location?: string;
}

interface UserProfile {
	_id: string;
	username: string;
	email: string;
	profilePicture: string;
	bio?: string;
	posts: Post[];
	followers?: string[];
	following?: string[];
}

interface Comment {
	username?: string;
	user: string;
	text: string;
	profileId: string;
	profileImage: string;
	createdAt: string;
}

const Profile: React.FC = () => {
	const [profile, setProfile] = useState<UserProfile | null>(null);
	// const [posts, setPosts] = useState([]);
	const [posts, setPosts] = useState<Post[]>([]);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [token] = useRecoilState(authTokenState);
	const [userId] = useRecoilState(userIdState);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { fetchPostsByUserId } = usePost();

	useEffect(() => {
		const loadProfile = async () => {
			if (token) {
				try {
					const response = await fetchProfile(token);
					const posts = await fetchPostsByUserId();
					setPosts(posts);
					console.log("Profile response:", response); // Add this for debugging
					const data = response.user;
					setProfile(data);
					setUsername(data.username || "");
					setBio(data.bio || "");
					setError(null);
				} catch (error) {
					setError("Error fetching profile: " + (error as Error).message);
				}
			} else {
				setError("No authentication token or user ID found");
			}
		};

		loadProfile();
	}, [token, userId]);

	const handleUpdate = async () => {
		if (profile && token) {
			try {
				const updatedData = { username, bio };
				const updatedProfile = await updateProfile(
					profile._id,
					updatedData,
					token
				);
				setProfile(updatedProfile);
				setEditMode(false);
			} catch (error) {
				console.error("Error updating profile:", error);
			}
		}
	};

	const handleDelete = async () => {
		if (profile && token) {
			try {
				await deleteProfile(profile._id, token);
				router.push("/login");
			} catch (error) {
				console.error("Error deleting profile:", error);
			}
		}
	};

	if (error) {
		return (
			<div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md text-red-500">
				{error}
			</div>
		);
	}

	if (!profile) {
		return (
			<div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center mt-10">
			{/* Profile Header */}
			<div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
				<div className="flex flex-col items-center mb-6">
					{/* Profile Picture */}
					<div className="w-28 h-28 rounded-full overflow-hidden border border-gray-300">
						<img
							src={profile.profilePicture || "/default-avatar.png"}
							alt="Profile Picture"
							className="w-full h-full object-cover"
						/>
					</div>
					{/* Username and Edit Button */}
					<div className="flex items-center justify-between w-full mt-4">
						<h2 className="text-xl font-bold text-center">
							{profile.username}
						</h2>
						<button
							className="text-sm font-semibold text-blue-500 hover:underline"
							onClick={() => setEditMode(!editMode)}>
							{editMode ? "Cancel" : "Edit Profile"}
						</button>
					</div>
					{/* Follower and Post Stats */}
					{!editMode && (
						<div className="flex justify-around w-full mt-4">
							<div className="text-center">
								<span className="font-bold">{posts ? posts.length : 0}</span>
								<p className="text-gray-500">Posts</p>
							</div>
							<div className="text-center">
								<span className="font-bold">
									{profile.followers?.length || 0}
								</span>
								<p className="text-gray-500">Followers</p>
							</div>
							<div className="text-center">
								<span className="font-bold">
									{profile.following?.length || 0}
								</span>
								<p className="text-gray-500">Following</p>
							</div>
						</div>
					)}
				</div>
				{/* Edit Mode */}
				{editMode ? (
					<div className="w-full mb-4">
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border border-gray-300 rounded p-2 w-full mb-2"
							placeholder="Username"
						/>
						<textarea
							value={bio}
							onChange={(e) => setBio(e.target.value)}
							className="border border-gray-300 rounded p-2 w-full mb-2"
							rows={3}
							placeholder="Bio"
						/>
						<button
							className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold"
							onClick={handleUpdate}>
							Save Changes
						</button>
					</div>
				) : (
					<div className="text-center mb-4">
						<p className="text-gray-600">{profile.bio || "No bio available"}</p>
					</div>
				)}
			</div>
			{/* Posts Section */}

			{!editMode && (
				<div className="w-full max-w-2xl mt-6">
					<div className="grid grid-cols-3 gap-1 md:gap-2">
						{posts && posts.length > 0 ? (
							posts.map((post) => (
								<div key={post._id} className="relative aspect-square group">
									{/* Post image */}
									<img
										src={post.imageUrl || "/default-image.jpg"}
										alt="Post"
										className="w-full h-full object-cover rounded-sm"
									/>

									{/* Overlay with likes and comments */}
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="flex items-center space-x-4">
											<span>❤️ {post?.likes ? post?.likes.length : 0}</span>
											<span>💬 {post?.comments.length}</span>
										</div>
									</div>

									{/* Latest comment section */}
									<div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white px-2 py-1 text-sm">
										{post?.comments && post.comments.length > 0 ? (
											<p>
												<strong>{post.comments[0]?.username}:</strong>{" "}
												{post.comments[0]?.text}
											</p>
										) : (
											<p>No comments yet</p>
										)}
									</div>
								</div>
							))
						) : (
							<p className="col-span-full text-center text-gray-600">
								No posts available.
							</p>
						)}
					</div>
				</div>
			)}

			{/* Delete Profile Button */}
			{!editMode && (
				<button
					className="bg-red-500 text-white px-4 py-2 rounded-lg mt-6"
					onClick={handleDelete}>
					Delete Profile
				</button>
			)}
		</div>
	);
};

export default Profile;
