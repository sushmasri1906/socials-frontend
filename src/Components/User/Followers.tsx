"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/types/types";
import { authTokenState } from "@/State/atoms";
import { useRecoilValue } from "recoil";
import { fetchFollowers } from "@/services/followService";

const Followers = () => {
	const { id } = useParams<{ id: string }>();
	const [followers, setFollowers] = useState<User[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const token = useRecoilValue(authTokenState);
	const router = useRouter();

	useEffect(() => {
		const loadFollowers = async () => {
			if (token && id) {
				try {
					const data = await fetchFollowers(id, token);
					setFollowers(data.followers);
				} catch (error) {
					setError("Error fetching followers: " + (error as Error).message);
				} finally {
					setLoading(false);
				}
			} else {
				setError("User is not authenticated or user ID is missing.");
				setLoading(false);
			}
		};

		loadFollowers();
	}, [id, token]);

	const handleNavigateToUserProfile = (followerId: string) => {
		router.push(`/user/${followerId}/followers`);
	};

	if (loading) {
		return <p>Loading followers...</p>;
	}

	if (error) {
		return <p className="text-red-500">{error}</p>;
	}

	return (
		<div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg bg-white">
			<h1 className="text-2xl font-bold mb-6">Followers</h1>
			{followers.length > 0 ? (
				<ul>
					{followers.map((follower) => (
						<li
							key={follower._id}
							className="flex items-center mb-4 cursor-pointer"
							onClick={() => handleNavigateToUserProfile(follower._id)}>
							<p className="font-medium">{follower.username}</p>
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-500">This user has no followers yet.</p>
			)}
		</div>
	);
};

export default Followers;
