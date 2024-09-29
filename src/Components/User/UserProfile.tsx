"use client";
import { useEffect, useState } from "react";
import {
	followUserService,
	unfollowUserService,
} from "@/services/UserProfileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { useParams, useRouter } from "next/navigation";
import { fetchOthersProfile } from "@/services/profileServices";
import Image from "next/image";
// import UserPosts from "./UserPosts";
import { User } from "@/types/types";
import UserPosts from "./UserPosts";

const UserProfile = () => {
	const [profile, setProfile] = useState<User | null>(null);
	const token = useRecoilValue(authTokenState);
	const { id } = useParams();
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [isFollowing, setIsFollowing] = useState<boolean>(false);
	const [hovering, setHovering] = useState<boolean>(false);
	const currentUser = useRecoilValue(userState);
	const router = useRouter();

	const loadProfile = async () => {
		if (token) {
			try {
				const data = await fetchOthersProfile(id as string, token);
				setProfile(data.user);
				setIsFollowing(data.user.followers.includes(currentUser._id));
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

	// Navigate to another user's profile when follower/following name is clicked
	// const handleNavigateToUserProfile = (userId: string) => {
	// 	router.push(`/user/${userId}`);
	// };

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
							<span className="font-semibold">{profile.posts.length || 0}</span>{" "}
							posts
						</div>
						<div
							className="cursor-pointer"
							onClick={() => router.push(`/user/${id}/followers`)}>
							<span className="font-semibold">
								{profile.followers?.length || 0}
							</span>{" "}
							followers
						</div>
						<div
							className="cursor-pointer"
							onClick={() => router.push(`/user/${id}/following`)}>
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
		</div>
	);
};

export default UserProfile;
