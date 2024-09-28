"use client";
import React, { useEffect, useState } from "react";
import {
	addLike,
	deleteLike,
	addComment,
	deleteComment,
	updateComment,
} from "@/services/UserProfileServices";
import { Post, User, Comment } from "@/types/types";
import { usePost } from "@/services/usePost";
import { useParams } from "next/navigation";

function UserPosts({
	currentUser,
	token,
}: {
	currentUser: User;
	token: string;
}) {
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

	const handleLike = async (postId: string) => {
		try {
			await addLike(postId, token as string);
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? { ...post, likes: [...post.likes, currentUser._id] }
						: post
				)
			);
		} catch (error) {}
	};

	const handleUnlike = async (postId: string) => {
		try {
			await deleteLike(postId, token as string);
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								likes: post.likes.filter((id) => id !== currentUser._id),
						  }
						: post
				)
			);
		} catch (error) {}
	};

	const handleUpdateComment = async (
		postId: string,
		commentId: string,
		newText: string
	) => {
		if (!newText.trim()) {
			return;
		}

		try {
			await updateComment(commentId, { text: newText }, postId, token!);

			// Optimistically update the comment in the state
			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								comments: post.comments.map((comment) =>
									comment._id === commentId
										? { ...comment, text: newText }
										: comment
								),
						  }
						: post
				)
			);
		} catch (error) {}
	};

	const handleDeleteComment = async (postId: string, commentId: string) => {
		try {
			await deleteComment(commentId, postId, token!);

			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								comments: post.comments.filter(
									(comment) => comment._id !== commentId
								),
						  }
						: post
				)
			);
		} catch (error) {}
	};

	const handleComment = async (postId: string, text: string) => {
		if (!text.trim()) {
			return;
		}

		try {
			await addComment(postId, text, token!);

			setPosts((prevPosts) =>
				prevPosts.map((post) =>
					post._id === postId
						? {
								...post,
								comments: [
									...(post.comments || []),
									{
										user: currentUser._id,
										text,
										_id: new Date().toISOString(),
										createdAt: new Date(),
									},
								],
						  }
						: post
				)
			);
		} catch (error) {}
	};

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
								<span
									onClick={() => {
										post.likes?.includes(currentUser._id)
											? handleUnlike(post._id)
											: handleLike(post._id);
									}}
									className="cursor-pointer transition-colors hover:text-red-400">
									❤️ {post.likes?.length || 0}
								</span>
								<span>💬 {post.comments?.length || 0}</span>
							</div>
							<div className="mt-2 text-white">
								{post.comments && post.comments.length > 0 ? (
									post.comments.map((comment: Comment) => (
										<div
											key={comment._id}
											className="flex justify-between items-center mb-2 text-sm">
											<span>
												<strong>{comment.user}</strong>: {comment.text}
											</span>
											<div>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														handleDeleteComment(post._id, comment._id);
													}}
													className="text-red-500 hover:underline mx-1">
													Delete
												</button>
												<button
													type="button"
													onClick={(e) => {
														e.stopPropagation();
														const newText = prompt(
															"Edit your comment:",
															comment.text
														);
														if (newText) {
															handleUpdateComment(
																post._id,
																comment._id,
																newText
															);
														}
													}}
													className="text-blue-500 hover:underline">
													Edit
												</button>
											</div>
										</div>
									))
								) : (
									<p>No comments yet.</p>
								)}
								<div>
									<input
										type="text"
										placeholder="Add a comment..."
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												handleComment(post._id, e.currentTarget.value);
												e.currentTarget.value = ""; // Clear input after adding comment
											}
										}}
										className="w-full bg-transparent text-white border-b border-white outline-none"
									/>
								</div>
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
