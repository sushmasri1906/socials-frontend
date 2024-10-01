// "use client";

// import { useState } from "react";

// import { useRecoilValue } from "recoil";
// import { authTokenState } from "@/State/atoms";

// const Upload = () => {
// 	const [file, setFile] = useState<File | null>(null);
// 	const [caption, setCaption] = useState("");
// 	const [location, setLocation] = useState("");
// 	const [uploading, setUploading] = useState(false);
// 	const [taggedUsers, setTaggedUsers] = useState([]);

// 	const token = useRecoilValue(authTokenState);
// 	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// 		if (e.target.files) {
// 			setFile(e.target.files[0]);
// 		}
// 	};

// 	const handleUpload = async () => {
// 		setUploading(true);
// 		setTaggedUsers([]);

// 		if (!file) return;

// 		// Create a FormData object
// 		const formData = new FormData();
// 		formData.append("file", file); // Add the file to the form data
// 		formData.append("caption", caption); // Add caption
// 		formData.append("location", location); // Add location
// 		formData.append("taggedUsers", JSON.stringify(taggedUsers)); // Add tagged users as a JSON string

// 		try {
// 			const response = await fetch("http://localhost:5000/ig/posts/create", {
// 				method: "POST",
// 				headers: {
// 					Authorization: `Bearer ${token}`, // Replace with your auth token
// 				},
// 				body: formData, // Send the FormData
// 			});

// 			const result = await response.json();

// 			// Handle the response
// 			console.log(result);
// 		} catch (error) {
// 			console.error("Error uploading post:", error);
// 		}

// 		setUploading(false);
// 	};

// 	return (
// 		<>
// 			{/* Upload Container */}
// 			<div className="text-center">
// 				<h2 className="text-lg font-semibold">Create New Post</h2>
// 			</div>

// 			{/* File Input */}
// 			<div className="w-full">
// 				<input
// 					type="file"
// 					onChange={handleFileChange}
// 					className="w-full p-2 border border-gray-300 rounded-md"
// 				/>
// 			</div>

// 			{/* Caption Input */}
// 			<div className="w-full">
// 				<label className="block text-sm font-medium text-gray-600 mb-1">
// 					Caption
// 				</label>
// 				<input
// 					className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// 					type="text"
// 					id="caption"
// 					onChange={(e) => setCaption(e.target.value)}
// 					value={caption}
// 					placeholder="Write a caption..."
// 				/>
// 			</div>

// 			{/* Location Input */}
// 			<div className="w-full">
// 				<label className="block text-sm font-medium text-gray-600 mb-1">
// 					Location
// 				</label>
// 				<input
// 					className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
// 					type="text"
// 					id="location"
// 					onChange={(e) => setLocation(e.target.value)}
// 					value={location}
// 					placeholder="Add a location..."
// 				/>
// 			</div>

// 			{/* Upload Button */}
// 			<button
// 				onClick={handleUpload}
// 				disabled={uploading}
// 				className={`w-full py-3 mt-2 rounded-md text-white font-semibold transition-colors duration-300 ${
// 					uploading
// 						? "bg-blue-300 cursor-not-allowed"
// 						: "bg-blue-500 hover:bg-blue-600"
// 				}`}>
// 				{uploading ? "Uploading..." : "Upload"}
// 			</button>
// 		</>
// 	);
// };

// export default Upload;
"use client";

import { useState } from "react";
import { useRecoilValue } from "recoil";
import { authTokenState } from "@/State/atoms";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
	const [file, setFile] = useState<File | null>(null);
	const [caption, setCaption] = useState("");
	const [location, setLocation] = useState("");
	const [uploading, setUploading] = useState(false);
	const [taggedUsers, setTaggedUsers] = useState<string[]>([]);

	const token = useRecoilValue(authTokenState);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	};

	const handleUpload = async () => {
		setUploading(true);

		if (!file) {
			toast.error("Please select an image file.");
			setUploading(false);
			return;
		}
		if (caption.trim() === "") {
			toast.error("Caption cannot be empty.");
			setUploading(false);
			return;
		}
		if (location.trim() === "") {
			toast.error("Location cannot be empty.");
			setUploading(false);
			return;
		}

		const formData = new FormData();
		formData.append("file", file);
		formData.append("caption", caption);
		formData.append("location", location);
		formData.append("taggedUsers", JSON.stringify(taggedUsers));

		try {
			const response = await fetch("http://localhost:5000/ig/posts/create", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.message || "Failed to upload post");
			}

			toast.success("Post uploaded successfully!");
			setFile(null);
			setCaption("");
			setLocation("");
			setTaggedUsers([]);
		} catch (error) {
			toast.error("Error uploading post: " + (error as Error).message);
		} finally {
			setUploading(false);
		}
	};

	return (
		<div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-lg max-w-md mx-auto">
			<h2 className="text-2xl font-semibold mb-4">Create New Post</h2>

			{/* File Input */}
			<input
				type="file"
				accept="image/*"
				onChange={handleFileChange}
				className="mb-4 w-full p-2 border border-gray-300 rounded-md transition duration-300 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
			/>

			{/* Preview Selected Image */}
			{file && (
				<img
					src={URL.createObjectURL(file)}
					alt="Selected File Preview"
					className="mb-4 rounded-lg max-h-[300px] object-cover"
				/>
			)}

			{/* Caption Input */}
			<label className="block text-sm font-medium text-gray-600 mb-1">
				Caption
			</label>
			<input
				className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
				type="text"
				onChange={(e) => setCaption(e.target.value)}
				value={caption}
				placeholder="Write a caption..."
			/>

			{/* Location Input */}
			<label className="block text-sm font-medium text-gray-600 mb-1">
				Location
			</label>
			<input
				className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
				type="text"
				onChange={(e) => setLocation(e.target.value)}
				value={location}
				placeholder="Add a location..."
			/>

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

			{/* Toast Container */}
			<ToastContainer />
		</div>
	);
};

export default Upload;
