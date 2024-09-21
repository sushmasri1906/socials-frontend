"use client";
import { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { authTokenState, postsState } from "../../State/atoms";
import { usePost } from "../../services/usePost";
import { getToken } from "../../Utils/tokenUtils";
import Image from "next/image";

const Posts = () => {
	const [posts, setPosts] = useRecoilState(postsState);
	const authToken = useRecoilValue(authTokenState);
	const { fetchAllPosts } = usePost();

	useEffect(() => {
		const loadPosts = async () => {
			try {
				const token = authToken ? authToken : getToken(); // Retrieve token using utility function
				if (token) {
					const fetchedPosts = await fetchAllPosts();
					setPosts(fetchedPosts);
				}
			} catch (error) {
				console.error("Failed to fetch posts:", error);
			}
		};

		loadPosts();
	}, [authToken, setPosts]);

	return (
		<div className="max-w-4xl mx-auto mt-10 p-6">
			<h2 className="text-2xl font-bold mb-4">User Posts</h2>
			<div className="space-y-6">
				{posts.length === 0 ? (
					<p>No posts available</p>
				) : (
					posts.map((post: any) => (
						<div
							key={post._id}
							className="p-4 border rounded-md shadow-sm space-y-4">
							{post.imageUrl && (
								<div className="relative w-full h-80">
									<Image
										src={post.imageUrl}
										alt="Post Image"
										layout="fill"
										objectFit="cover"
										className="rounded-md"
									/>
								</div>
							)}
							<div className="space-y-2">
								<h3 className="text-xl font-semibold">{post.caption}</h3>
								<p className="text-gray-700">{post.location}</p>
								<small className="text-gray-600">
									Posted by: {post.user?.username || "Unknown"}
								</small>
							</div>
							<div className="border-t pt-2">
								<h4 className="font-medium text-lg">Comments</h4>
								{post.comments && post.comments.length > 0 ? (
									post.comments.map((comment: any, index: number) => (
										<div
											key={index}
											className="flex space-x-2 mt-2 text-sm text-gray-800">
											<strong>{comment.user.username}:</strong>
											<p>{comment.text}</p>
										</div>
									))
								) : (
									<p className="text-gray-500">No comments yet</p>
								)}
							</div>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Posts;
