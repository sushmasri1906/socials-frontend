"use client";
import React, { useEffect, useState } from "react";
import {
	fetchProfile,
	updateProfile,
	deleteProfile,
} from "@/services/profileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { useRouter } from "next/navigation";
import { usePost } from "@/services/usePost";
import { fetchFollowers, fetchFollowing } from "@/services/followService";
import { Post, User } from "@/types/types";
import Link from "next/link";
import Image from "next/image";

const Profile: React.FC = () => {
	const [profile, setProfile] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [followers, setFollowers] = useState<User[]>([]);
	const [following, setFollowing] = useState<User[]>([]);
	const [showFollowers, setShowFollowers] = useState<boolean>(false);
	const [showFollowing, setShowFollowing] = useState<boolean>(false);
	const [editMode, setEditMode] = useState<boolean>(false);
	const [username, setUsername] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const token = useRecoilValue(authTokenState);
	const user = useRecoilValue(userState);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();
	const { fetchPostsByUserId } = usePost();

	useEffect(() => {
		const loadProfile = async () => {
			if (token) {
				try {
					const response = await fetchProfile(token);
					const userPosts = await fetchPostsByUserId(response.user._id);
					const userFollowers = await fetchFollowers(response.user._id, token);
					const userFollowing = await fetchFollowing(response.user._id, token);

					setPosts(userPosts);
					setFollowers(userFollowers.followers);
					setFollowing(userFollowing.following);
					console.log(followers);

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
	}, [token, user._id]);

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

	// Toggle visibility of followers or following
	const toggleFollowers = () => {
		setShowFollowers(true);
		setShowFollowing(false);
	};

	const toggleFollowing = () => {
		setShowFollowing(true);
		setShowFollowers(false);
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
		<div className="flex flex-col items-center mt-10 bg-gray-50">
			<div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
				<div className="flex flex-col items-center mb-6">
					<div className="w-28 h-28 rounded-full overflow-hidden border-4">
						<Image
							src={profile.profilePicture}
							alt="Profile Picture"
							className="w-full h-full object-cover"
							width={112}
							height={112}
						/>
					</div>
					<div className="flex items-center justify-between w-full mt-4">
						<h2 className="text-2xl font-bold text-center text-gray-800">
							{profile.username}
						</h2>
						<button
							className="text-sm font-semibold text-blue-500 hover:text-blue-700"
							onClick={() => setEditMode(!editMode)}>
							{editMode ? "Cancel" : "Edit Profile"}
						</button>
					</div>
					{!editMode && (
						<div className="flex justify-around w-full mt-4">
							<div
								className="text-center cursor-pointer"
								onClick={toggleFollowers}>
								<span className="font-bold">
									{followers && followers.length}
								</span>
								<p className="text-gray-500">Followers</p>
							</div>
							<div
								className="text-center cursor-pointer"
								onClick={toggleFollowing}>
								<span className="font-bold">
									{following && following.length}
								</span>
								<p className="text-gray-500">Following</p>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Followers Section */}
			{showFollowers && (
				<div className="w-full max-w-2xl mt-6">
					<h2 className="text-xl font-semibold mb-4">Followers</h2>
					<ul className="divide-y">
						{followers && followers.length > 0 ? (
							followers.map((follower) => (
								<li key={follower._id} className="py-2 flex items-center">
									<img
										src={follower.profilePicture || "/default-avatar.png"}
										alt={follower.username}
										className="w-8 h-8 rounded-full border mr-2"
									/>
									<span>{follower.username}</span>
								</li>
							))
						) : (
							<p>No followers yet.</p>
						)}
					</ul>
				</div>
			)}

			{/* Following Section */}
			{showFollowing && (
				<div className="w-full max-w-2xl mt-6">
					<h2 className="text-xl font-semibold mb-4">Following</h2>
					<ul className="divide-y">
						{following && following.length > 0 ? (
							following.map((followed) => (
								<li key={followed._id} className="py-2 flex items-center">
									<img
										src={followed.profilePicture || "/default-avatar.png"}
										alt={followed.username}
										className="w-8 h-8 rounded-full border mr-2"
									/>
									<span>{followed.username}</span>
								</li>
							))
						) : (
							<p>You are not following anyone yet.</p>
						)}
					</ul>
				</div>
			)}

			{/* Posts Section */}
			{!editMode && !showFollowers && !showFollowing && (
				<div className="w-full max-w-2xl mt-6">
					<div className="grid grid-cols-3 gap-2">
						{posts && posts.length > 0 ? (
							posts.map((post) => (
								<div
									key={post._id}
									className="relative aspect-square group rounded-lg overflow-hidden shadow-lg">
									<img
										src={post.imageUrl || "/default-image.jpg"}
										alt="Post"
										className="w-full h-full object-cover"
									/>
									<div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex justify-center items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
										<div className="flex items-center space-x-4">
											<span>❤️ {post.likes && post.likes.length}</span>
											<span>💬 {post.comments && post.comments.length}</span>
										</div>
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
			<Link href={"/profile/edit"}>Edit</Link>

			{/* Delete Profile Button */}
			{!editMode && !showFollowers && !showFollowing && (
				<button
					className="bg-red-600 text-white px-4 py-2 rounded-lg mt-6 transition hover:bg-red-700"
					onClick={handleDelete}>
					Delete Profile
				</button>
			)}
		</div>
	);
};

export default Profile;
