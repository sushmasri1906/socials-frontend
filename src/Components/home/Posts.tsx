"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { usePost } from "../../services/usePost";
import { getToken } from "../../Utils/tokenUtils";
import { Post } from "@/types/types";
import { authTokenState } from "@/State/atoms";
import EachPost from "./EachPost";

interface PostWithPopulatedUser extends Omit<Post, "user"> {
	user: {
		id: string;
		username: string;
		profilePicture: string;
	};
}

const Posts = () => {
	const [posts, setPosts] = useState<PostWithPopulatedUser[]>([]);
	const [error, setError] = useState<string | null>(null);
	const authToken = useRecoilValue(authTokenState);
	const { fetchAllPosts } = usePost();

	const loadPosts = async () => {
		try {
			const token = authToken || getToken();
			if (token) {
				const fetchedPosts = await fetchAllPosts();
				setPosts(fetchedPosts);
			}
		} catch (error) {
			setError("Failed to fetch posts: " + (error as Error).message);
		}
	};

	useEffect(() => {
		loadPosts();
	}, [authToken]);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div className="max-w-3xl mx-auto mt-4 sm:mt-10 p-6">
			<h2 className="text-3xl font-bold mb-6">Feed</h2>
			<div className="space-y-8">
				{posts.length === 0 ? (
					<p>No posts available</p>
				) : (
					posts.map((post) => (
						<div key={post._id}>
							<EachPost post={post} />
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Posts;
