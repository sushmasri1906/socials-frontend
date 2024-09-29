"use client";
import { useEffect, useState } from "react";
import { Post } from "@/types/types";
import { usePost } from "@/services/usePost";
import { useParams } from "next/navigation";

function UserPosts({ token }: { token: string }) {
	const { id } = useParams();
	const { fetchPostsByOthersUserId } = usePost();
	const [posts, setPosts] = useState<Post[]>([]);

	const loadProfile = async () => {
		if (token) {
			try {
				const posts = await fetchPostsByOthersUserId(id as string);
				setPosts(posts);
			} catch (error) {}
		} else {
		}
	};

	useEffect(() => {
		loadProfile();
	}, [id, token]);

	return (
		<div className="grid grid-cols-3 gap-4 mt-10">
			{posts && posts.length > 0 ? (
				posts.map((post) => (
					<div key={post._id} className="relative">
						<img
							src={post.imageUrl || "/default-image.jpg"}
							alt="Post"
							className="w-full h-full object-cover rounded-lg shadow-md transition-transform transform hover:scale-105"
						/>
						<div className="absolute inset-0 bg-black bg-opacity-25 flex flex-col justify-between p-4 rounded-lg">
							<div className="flex justify-between text-white">
								<span className="cursor-pointer transition-colors hover:text-red-400">
									❤️ {post.likes?.length || 0}
								</span>
								<span>💬 {post.comments?.length || 0}</span>
							</div>
						</div>
					</div>
				))
			) : (
				<p className="col-span-3 text-center">No posts available.</p>
			)}
		</div>
	);
}

export default UserPosts;
