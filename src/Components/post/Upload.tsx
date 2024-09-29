"use client";

import { useState } from "react";
// import { usePost } from "@/services/usePost";
// import { useHandleImage } from "@/services/useHandleImage";
import { useRecoilValue } from "recoil";
import { authTokenState } from "@/State/atoms";

const Upload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [uploading, setUploading] = useState(false);
	const [taggedUsers, setTaggedUsers] = useState([]);
	// const { handleImageUpload } = useHandleImage();
	// const { createPost } = usePost();
	const token = useRecoilValue(authTokenState);
	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		setUploading(true);
		setTaggedUsers([]);

		if (!file) return;

		// Create a FormData object
		const formData = new FormData();
		formData.append("file", file); // Add the file to the form data
		formData.append("caption", caption); // Add caption
		formData.append("location", location); // Add location
		formData.append("taggedUsers", JSON.stringify(taggedUsers)); // Add tagged users as a JSON string

		try {
			const response = await fetch("http://localhost:5000/ig/posts/create", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`, // Replace with your auth token
				},
				body: formData, // Send the FormData
			});

			const result = await response.json();

			// Handle the response
			console.log(result);
		} catch (error) {
			console.error("Error uploading post:", error);
		}

		setUploading(false);
	};

	return (
		<>
			{/* Upload Container */}
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
		</>
	);
};

export default Upload;
