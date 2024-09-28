"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchFollowing } from "@/services/followService";
import { User } from "@/types/types";
import { authTokenState } from "@/State/atoms";
import { useRecoilValue } from "recoil";

const Following: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const [following, setFollowing] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const token = useRecoilValue(authTokenState);
	const router = useRouter();

	useEffect(() => {
		const loadFollowing = async () => {
			if (token && id) {
				try {
					const data = await fetchFollowing(id, token);
					setFollowing(data.following);
				} catch (error) {
					setError("Error fetching following: " + (error as Error).message);
				} finally {
					setLoading(false);
				}
			} else {
				setError("User is not authenticated or user ID is missing.");
				setLoading(false);
			}
		};

		loadFollowing();
	}, [id, token]);

	const handleNavigateToUserProfile = (followedId: string) => {
		router.push(`/user/${followedId}/followers`);
	};

	if (loading) {
		return <p className="text-center">Loading following...</p>;
	}

	if (error) {
		return <p className="text-red-500 text-center">{error}</p>;
	}

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
			<h1 className="text-3xl font-bold mb-6 text-center">Following</h1>
			{following.length > 0 ? (
				<ul className="divide-y">
					{following.map((followed) => (
						<li
							key={followed._id}
							className="flex items-center py-4 cursor-pointer hover:bg-gray-100 transition"
							onClick={() => handleNavigateToUserProfile(followed._id)}>
							<img
								src={followed.profilePicture || "/default-avatar.png"}
								alt={followed.username}
								className="w-10 h-10 rounded-full border mr-4"
							/>
							<div>
								<p className="font-medium">{followed.username}</p>
								<p className="text-gray-600 text-sm">{followed.bio}</p>
							</div>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500 text-center">
					You are not following anyone yet.
				</p>
			)}
		</div>
	);
};

export default Following;
