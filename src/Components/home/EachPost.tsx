"use client";

import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { authTokenState, userState } from "@/State/atoms";
import { addLike, deleteLike } from "@/services/UserProfileServices";
import { FaComments } from "react-icons/fa";
import Comments from "./Comments";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { PostWithPopulatedUser } from "@/types/types";

function EachPost({ post }: { post: PostWithPopulatedUser }) {
	const [closeComment, setCloseComment] = useState(false);
	const token = useRecoilValue(authTokenState);
	const [error, setError] = useState<string | null>(null);
	const authToken = useRecoilValue(authTokenState);
	const currentUser = useRecoilValue(userState);
	const router = useRouter();
	const [like, setLike] = useState<string[]>([]);

	const getTimeDifference = (createdAt: string | Date): string => {
		const now = new Date();
		const postDate = new Date(createdAt);
		const timeDifference = Math.abs(now.getTime() - postDate.getTime()); // Time difference in milliseconds

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
			setTimeout(() => {
				console.log("cliked unlike");
			}, 500);
		} catch (error) {
			setError("Error liking post: " + (error as Error).message);
		}
	};

	const handleUnlike = async () => {
		try {
			await deleteLike(post._id, authToken!);
			setLike(() => like.filter((id) => id !== currentUser._id));
			setTimeout(() => {
				console.log("cliked unlike");
			}, 500);
		} catch (error) {
			setError("Error unliking post: " + (error as Error).message);
		}
	};

	const handleNavigateToProfile = () => {
		if (post.user._id == currentUser._id) {
			router.push(`/profile`);
			return;
		} else router.push(`/user/${post.user._id}`);
	};

	useEffect(() => {
		// Check if the post is liked by the current user
		setLike([...post.likes]);
	}, []);

	if (error) return <p className="text-red-500">{error}</p>;

	return (
		<div
			key={post._id}
			className="p-4 border rounded-md shadow-sm space-y-4 bg-white w-full sm:w-fit h-fit">
			<div className="flex items-center gap-x-4">
				{post.user.profilePicture && (
					<div>
						<Image
							src={post.user.profilePicture}
							alt={"profile image"}
							width={32}
							height={32}
							className="h-8 w-8 rounded-full"
						/>
					</div>
				)}
				<p className="text-black font-semibold">
					<span className="cursor-pointer" onClick={handleNavigateToProfile}>
						{post.user.username || "Unknown"}
					</span>
				</p>
				{post.createdAt && (
					<p className=" text-gray-500">{getTimeDifference(post.createdAt)}</p>
				)}
			</div>
			{post.imageUrl && (
				<div className="relative w-full max-h-[calc(100%-32px)] sm:w-[468px] sm:h-auto sm:max-h-[580px] border border-gray-200 rounded">
					<Image
						src={post.imageUrl}
						alt="Post Image"
						layout="responsive"
						width={300}
						height={400}
						objectFit="cover"
						className="rounded-md  max-h-[calc(100%-32px)] sm:max-h-[580px]"
					/>
				</div>
			)}

			<div className="space-y-2">
				<h3 className="text-xl font-semibold">{post.caption}</h3>
			</div>
			<div className="flex items-center gap-x-4 border-t pt-2">
				<span>{like.length} likes</span>
				<div className="flex justify-between">
					{like.includes(currentUser._id) ? (
						<button onClick={handleUnlike} className=" text-blue-500">
							<FcLike />
						</button>
					) : (
						<button onClick={handleLike} className=" text-blue-500">
							<FcLikePlaceholder />
						</button>
					)}
				</div>
				{/* <h4 className="font-medium text-lg mt-4 flex items-center">
					<FaComment className="mr-2" /> Comments
				</h4> */}
				<button onClick={() => setCloseComment(true)}>
					<FaComments />
				</button>
				{closeComment && (
					<div className="relative">
						<Comments
							post={post}
							token={token}
							close={() => {
								setCloseComment(false);
							}}
						/>
					</div>
				)}
			</div>
		</div>
	);
}

export default EachPost;
