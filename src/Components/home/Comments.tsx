"use client";
import React, { useEffect, useRef, useState } from "react";
import { addComment } from "@/services/UserProfileServices";
import { PostWithPopulatedUser, Comment } from "@/types/types";

function Comments({
	post,
	token,
	close,
}: {
	post: PostWithPopulatedUser;
	token: string | null;
	close: () => void;
}) {
	const [comment, setComment] = useState<string>("");
	const [comments, setComments] = useState<Comment[]>(post.comments);
	const commentBoxRef = useRef<HTMLDivElement>(null); // Ref for the comment box

	// Function to handle adding a comment
	const handleComment = async () => {
		if (comment.length > 0) {
			try {
				const response = await addComment(post._id, comment, token!);

				// Clear the input after submitting the comment
				setComment("");

				// Update the comments state
				setComments([
					...comments,
					{
						_id: response.comment._id,
						user: response.comment.user,
						username: response.username,
						text: comment,
						createdAt: new Date(),
					},
				]);
			} catch (error) {
				console.error("Failed to add comment:", error);
			}
		}
	};

	// Close popup if clicked outside the comment box
	useEffect(() => {
		const handleOutsideClick = (event: MouseEvent) => {
			if (
				commentBoxRef.current &&
				!commentBoxRef.current.contains(event.target as Node)
			) {
				close(); // Trigger the close function if clicked outside the comment box
			}
		};

		document.addEventListener("mousedown", handleOutsideClick);

		return () => {
			document.removeEventListener("mousedown", handleOutsideClick);
		};
	}, [close]);

	return (
		<div className="fixed inset-0 bg-opacity-90 bg-black flex flex-col p-4 justify-end items-center z-10">
			<div
				ref={commentBoxRef} // Attach the ref to the comment box
				className="flex flex-col bg-white w-full max-w-[300px] sm:max-w-[600px] p-4 rounded">
				<div className="flex-grow overflow-y-auto mt-2 gap-2">
					{comments.length > 0 ? (
						comments.map((comment) => (
							<div
								key={comment._id}
								className="flex space-x-2 mt-2 text-sm text-gray-800">
								<strong>{comment.username}:</strong>
								<p>{comment.text}</p>
							</div>
						))
					) : (
						<p className="text-gray-400">No comments yet</p>
					)}
				</div>

				<div className="flex mt-2">
					<input
						type="text"
						placeholder="Add a comment..."
						value={comment}
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleComment();
								e.currentTarget.value = "";
							}
						}}
						onChange={(e) => setComment(e.target.value)}
						className="border rounded-md flex-1 p-2"
					/>
					<span
						onClick={handleComment}
						className="h-8 w-8 text-2xl font-bold flex justify-center items-center cursor-pointer">
						{">"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default Comments;
