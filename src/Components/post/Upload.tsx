"use client";

import { useState } from "react";
import { authTokenState } from "@/State/atoms";
import { useRecoilValue } from "recoil";
import { usePost } from "@/services/usePost";
import { useHandleImage } from "@/services/useHandleImage";

const Upload = () => {
	const token = useRecoilValue(authTokenState);
	const [file, setFile] = useState<File | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [uploading, setUploading] = useState(false);
	const [taggedUsers, setTaggedUsers] = useState([]);
	const { handleImageUpload } = useHandleImage();
	const { createPost } = usePost();
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		setUploading(true);
		if (!file) return;
		const url = await handleImageUpload(file);

		const upload = async () => {
			if (!url) return;
			const response = await createPost({
				imageUrl: url,
				caption,
				location,
				taggedUsers,
			});
		};
		upload();

		setUploading(false);
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			{/* Upload Container */}
			<div className="bg-white shadow-md rounded-md w-full max-w-md p-6 space-y-4">
				<div className="text-center">
					<h2 className="text-lg font-semibold">Create New Post</h2>
				</div>

				{/* File Input */}
				<div className="w-full">
					<input
						type="file"
						onChange={handleFileChange}
						className="w-full p-2 border border-gray-300 rounded-md"
					/>
				</div>

				{/* Caption Input */}
				<div className="w-full">
					<label className="block text-sm font-medium text-gray-600 mb-1">
						Caption
					</label>
					<input
						className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						type="text"
						id="caption"
						onChange={(e) => setCaption(e.target.value)}
						value={caption}
						placeholder="Write a caption..."
					/>
				</div>

				{/* Location Input */}
				<div className="w-full">
					<label className="block text-sm font-medium text-gray-600 mb-1">
						Location
					</label>
					<input
						className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
						type="text"
						id="location"
						onChange={(e) => setLocation(e.target.value)}
						value={location}
						placeholder="Add a location..."
					/>
				</div>

				{/* Upload Button */}
				<button
					onClick={handleUpload}
					disabled={uploading}
					className={`w-full py-3 mt-2 rounded-md text-white font-semibold transition-colors duration-300 ${
						uploading
							? "bg-blue-300 cursor-not-allowed"
							: "bg-blue-500 hover:bg-blue-600"
					}`}>
					{uploading ? "Uploading..." : "Upload"}
				</button>
			</div>
		</div>
	);
};

export default Upload;
