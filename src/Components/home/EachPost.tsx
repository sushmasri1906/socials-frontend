"use client";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authTokenState, userState } from "@/State/atoms";
import { addLike, deleteLike } from "@/services/UserProfileServices";
import Comments from "./Comments";
import { PostWithPopulatedUser } from "@/types/types";
import { FcLikePlaceholder } from "react-icons/fc";
import { AiOutlineComment, AiFillHeart, AiOutlineClose } from "react-icons/ai";

function EachPost({ post }: { post: PostWithPopulatedUser }) {
	const [showComments, setShowComments] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const authToken = useRecoilValue(authTokenState);
	const currentUser = useRecoilValue(userState);
	const router = useRouter();
	const [like, setLike] = useState<string[]>([]);

	const getTimeDifference = (createdAt: string | Date): string => {
		const now = new Date();
		const postDate = new Date(createdAt);
		const timeDifference = Math.abs(now.getTime() - postDate.getTime());

		const seconds = Math.floor(timeDifference / 1000);
		const minutes = Math.floor(seconds / 60);
		const hours = Math.floor(minutes / 60);
		const days = Math.floor(hours / 24);

		if (days > 0) {
			return `${days} day${days > 1 ? "s" : ""} ago`;
		} else if (hours > 0) {
			return `${hours} hour${hours > 1 ? "s" : ""} ago`;
		} else if (minutes > 0) {
			return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
		} else {
			return `${seconds} second${seconds > 1 ? "s" : ""} ago`;
		}
	};

	const handleLike = async () => {
		try {
			await addLike(post._id, authToken!);
			setLike((prev) => [...prev, currentUser._id]);
		} catch (error) {
			setError("Error liking post: " + (error as Error).message);
		}
	};

	const handleUnlike = async () => {
		try {
			await deleteLike(post._id, authToken!);
			setLike((prev) => prev.filter((id) => id !== currentUser._id));
		} catch (error) {
			setError("Error unliking post: " + (error as Error).message);
		}
	};

	const handleNavigateToProfile = () => {
		if (post.user._id === currentUser._id) {
			router.push(`/profile`);
		} else {
			router.push(`/user/${post.user._id}`);
		}
	};

	useEffect(() => {
		setLike([...post.likes]);
	}, [post.likes]);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div
			key={post._id}
			className="p-4 border rounded-md shadow-sm space-y-4 bg-white w-full sm:w-fit h-fit">
			{/* User Info */}
			<div className="flex items-center gap-x-4">
				{post.user.profilePicture && (
					<Image
						src={post.user.profilePicture}
						alt={"profile image"}
						width={32}
						height={32}
						className="h-8 w-8 rounded-full"
					/>
				)}
				<p
					className="text-black font-semibold cursor-pointer"
					onClick={handleNavigateToProfile}>
					{post.user.username || "Unknown"}
				</p>
				{post.createdAt && (
					<p className="text-gray-500">{getTimeDifference(post.createdAt)}</p>
				)}
			</div>

			{/* Post Image */}
			{post.imageUrl && (
				<div className="relative w-full max-h-[calc(100%-32px)] sm:w-[468px] sm:h-auto sm:max-h-[580px] border border-gray-200 rounded">
					<Image
						src={post.imageUrl}
						alt="Post Image"
						layout="responsive"
						width={300}
						height={400}
						objectFit="cover"
						className="rounded-md max-h-[calc(100%-32px)] sm:max-h-[580px]"
					/>
				</div>
			)}

			{/* Post Caption */}
			<div className="space-y-2">
				<h3 className="text-xl font-semibold">{post.caption}</h3>
			</div>

			{/* Likes and Comments */}
			<div className="flex items-center gap-x-4 border-t pt-2">
				<div className="flex items-center gap-x-1">
					{like.includes(currentUser._id) ? (
						<button
							onClick={handleUnlike}
							className="text-red-500 hover:text-red-700">
							<AiFillHeart />
						</button>
					) : (
						<button
							onClick={handleLike}
							className="text-blue-500 hover:text-blue-700">
							<FcLikePlaceholder />
						</button>
					)}
					<span>{like.length}</span>
				</div>

				<span
					className="flex items-center gap-x-1 cursor-pointer text-gray-500"
					onClick={() => setShowComments((prev) => !prev)}>
					<AiOutlineComment />
					<span>{post.comments.length}</span>
				</span>
			</div>

			{/* Comments Section */}
			{showComments && (
				<div className="mt-4 border-t pt-2">
					<Comments
						post={post}
						token={authToken}
						close={() => setShowComments(false)}
					/>
					<button
						onClick={() => setShowComments(false)}
						className="text-red-500 flex items-center gap-x-1 mt-2">
						<AiOutlineClose />
						Close
					</button>
				</div>
			)}
		</div>
	);
}

export default EachPost;
