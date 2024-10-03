"use client";
import { useEffect, useState } from "react";
import {
	followUserService,
	unfollowUserService,
} from "@/services/UserProfileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { useParams } from "next/navigation";
import { fetchOthersProfile } from "@/services/profileServices";
import Image from "next/image";
import { User } from "@/types/types";
import UserPosts from "./UserPosts";
import ViewFollowers from "./ViewFollowers";

const UserProfile = () => {
	const [profile, setProfile] = useState<User | null>(null);
	const [following, setFollowing] = useState<User[]>([]);
	const [showFollowers, setShowFollowers] = useState<boolean>(false);
	const [showFollowing, setShowFollowing] = useState<boolean>(false);
	const token = useRecoilValue(authTokenState);
	const { id } = useParams();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isFollowing, setIsFollowing] = useState<boolean>(false);
	const [hovering, setHovering] = useState<boolean>(false);
	const currentUser = useRecoilValue(userState);

	const loadProfile = async () => {
		if (token) {
			try {
				const data = await fetchOthersProfile(id as string, token);
				setProfile(data.user);
				setIsFollowing(data.user.followers.includes(currentUser._id));
				setFollowing(data.user.following);
				setError(null);
			} catch (error) {
				setError("Error fetching profile: " + (error as Error).message);
			} finally {
				setLoading(false);
			}
		} else {
			setError("No authentication token or user ID found");
		}
	};

	useEffect(() => {
		loadProfile();
	}, [id, token]);

	const handleFollow = async () => {
		if (profile && token) {
			try {
				await followUserService(profile._id, token);
				setIsFollowing(true);
				loadProfile(); // Refresh profile after following
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
				loadProfile(); // Refresh profile after unfollowing
			} catch (error) {
				setError("Error unfollowing user: " + (error as Error).message);
			}
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
		<div className="max-w-4xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
			{/* Profile Header */}
			<div className="flex items-center">
				<div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
					<Image
						src={profile.profilePicture}
						alt="Profile Picture"
						className="w-full h-full object-cover"
						width={112}
						height={112}
					/>
				</div>
				<div className="flex-1 ml-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold">{profile.username}</h2>
						<button
							className={`px-4 py-2 text-sm rounded-lg transition ${
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
					<div className="flex space-x-6 mt-4">
						<div>
							<span className="font-semibold">
								{profile.posts?.length || 0}
							</span>{" "}
							posts
						</div>
						<div
							className="cursor-pointer"
							onClick={() => setShowFollowers(true)}>
							<span className="font-semibold">
								{profile.followers?.length || 0}
							</span>{" "}
							followers
						</div>
						<div
							className="cursor-pointer"
							onClick={() => setShowFollowing(true)}>
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
			<UserPosts token={token!} />

			{/* Modal for Followers */}
			{showFollowers && (
				<ViewFollowers
					userId={profile._id}
					close={() => setShowFollowers(false)}
				/>
			)}

			{/* Modal for Following */}
			{showFollowing && (
				<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
					<div className="bg-white rounded-lg p-6 w-96">
						<h2 className="text-xl font-semibold mb-4">Following</h2>
						<ul className="divide-y">
							{JSON.stringify(following) + "this is following"}
							{following?.length > 0 ? (
								following.map((user) => (
									<li key={user._id} className="py-2 flex items-center">
										<Image
											src={user.profilePicture}
											alt={user.username}
											className="w-10 h-10 rounded-full border mr-2"
											width={40}
											height={40}
										/>
										<span className="font-medium">{user.username}</span>
									</li>
								))
							) : (
								<p>Not following anyone yet.</p>
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

export default UserProfile;
