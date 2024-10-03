"use client";
import React, { useEffect, useState } from "react";
import { fetchProfile } from "@/services/profileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { usePost } from "@/services/usePost";
import { fetchFollowers, fetchFollowing } from "@/services/followService";
import { Post, User } from "@/types/types";
import Link from "next/link";
import Image from "next/image";
import Spinner from "@/Components/Spinner";

const Profile: React.FC = () => {
	const [profile, setProfile] = useState<User | null>(null);
	const [posts, setPosts] = useState<Post[]>([]);
	const [followers, setFollowers] = useState<User[]>([]);
	const [following, setFollowing] = useState<User[]>([]);
	const token = useRecoilValue(authTokenState);
	const user = useRecoilValue(userState);
	const [error, setError] = useState<string | null>(null);
	const { fetchPostsByUserId } = usePost();
	const [loading, setLoading] = useState<boolean>(true); // Add loading state
	const [showFollowers, setShowFollowers] = useState<boolean>(false);
	const [showFollowing, setShowFollowing] = useState<boolean>(false);

	useEffect(() => {
		const loadProfile = async () => {
			if (token) {
				setLoading(true); // Start loading
				try {
					const response = await fetchProfile(token);
					const userId = response.user._id;

					// Fetch posts, followers, and following concurrently
					const [userPosts, userFollowers, userFollowing] = await Promise.all([
						fetchPostsByUserId(),
						fetchFollowers(userId, token),
						fetchFollowing(userId, token),
					]);

					setPosts(userPosts);
					setFollowers(userFollowers.followers);
					setFollowing(userFollowing.following);
					setProfile(response.user);
					setError(null);
				} catch (error) {
					setError("Error fetching profile: " + (error as Error).message);
				} finally {
					setLoading(false); // End loading
				}
			} else {
				setError("No authentication token or user ID found");
			}
		};

		loadProfile();
	}, [token, user._id]);

	if (loading) {
		return <Spinner />; // Show the spinner while loading
	}

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
				{/* Profile Information */}
				<div className="flex flex-col items-center mb-6">
					<div className="w-28 h-28 rounded-full overflow-hidden border-4 border-blue-500">
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
						<Link href={"/profile/edit"}>
							<button className="text-sm font-semibold text-blue-500 hover:text-blue-700">
								Edit Profile
							</button>
						</Link>
					</div>
				</div>

				{/* Followers and Following Count */}
				<div className="flex justify-between w-full mb-4">
					<div
						className="text-center cursor-pointer"
						onClick={() => setShowFollowers(true)}>
						<span className="font-bold">{followers?.length || 0}</span>
						<p className="text-gray-500">Followers</p>
					</div>
					<div
						className="text-center cursor-pointer"
						onClick={() => setShowFollowing(true)}>
						<span className="font-bold">{following?.length || 0}</span>
						<p className="text-gray-500">Following</p>
					</div>
					<div className="text-center">
						<span className="font-bold">{posts?.length || 0}</span>
						<p className="text-gray-500">Posts</p>
					</div>
				</div>
			</div>

			{/* Posts Section */}
			<div className="w-full max-w-2xl mt-6">
				<h2 className="text-xl font-semibold mb-4">Posts</h2>
				<div className="grid grid-cols-3 gap-4">
					{posts && posts.length > 0 ? (
						posts.map((post) => (
							<div
								key={post._id}
								className="relative aspect-square group rounded-lg overflow-hidden shadow-lg">
								<Image
									src={post.imageUrl || "/default-image.jpg"}
									alt="Post"
									className="w-full h-full object-cover"
									width={300}
									height={300}
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

			{/* Modal for Followers */}
			{showFollowers && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg p-6 w-96">
						<h2 className="text-xl font-semibold mb-4">Followers</h2>
						<ul className="divide-y">
							{followers && followers.length > 0 ? (
								followers.map((follower) => (
									<li key={follower._id} className="py-2 flex items-center">
										<Image
											src={follower.profilePicture || "/default-avatar.png"}
											alt={follower.username}
											className="w-10 h-10 rounded-full border mr-2"
											width={40}
											height={40}
										/>
										<span className="font-medium">{follower.username}</span>
									</li>
								))
							) : (
								<p>No followers yet.</p>
							)}
						</ul>
						<button
							className="mt-4 text-blue-500"
							onClick={() => setShowFollowers(false)}>
							Close
						</button>
					</div>
				</div>
			)}

			{/* Modal for Following */}
			{showFollowing && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg p-6 w-96">
						<h2 className="text-xl font-semibold mb-4">Following</h2>
						<ul className="divide-y">
							{following?.length > 0 ? (
								following.map((followed) => (
									<li key={followed._id} className="py-2 flex items-center">
										<Image
											src={followed.profilePicture || "/default-avatar.png"}
											alt={followed.username}
											className="w-10 h-10 rounded-full border mr-2"
											width={40}
											height={40}
										/>
										<span className="font-medium">{followed.username}</span>
									</li>
								))
							) : (
								<p>You are not following anyone yet.</p>
							)}
						</ul>
						<button
							className="mt-4 text-blue-500"
							onClick={() => setShowFollowing(false)}>
							Close
						</button>
					</div>
				</div>
			)}
		</div>
	);
};

export default Profile;
