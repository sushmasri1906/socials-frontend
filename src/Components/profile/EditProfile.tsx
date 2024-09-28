"use client";
import React, { useEffect, useState } from "react";
import { fetchProfile, updateProfile } from "@/services/profileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { User } from "@/types/types";
import Image from "next/image";
import { useProfile } from "@/services/useProfile";

const EditProfile: React.FC = () => {
	const [profile, setProfile] = useState<User>({
		_id: "",
		username: "",
		email: "",
		profilePicture: "",
		bio: "",
		isFollowing: false,
		followers: [],
		following: [],
		posts: [],
	});
	const [username, setUsername] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const token = useRecoilValue(authTokenState);
	const user = useRecoilValue(userState);
	const [error, setError] = useState<string | null>(null);
	const [profileImg, setProfileImg] = useState<File | null>(null);
	const [imgPreview, setImgPreview] = useState<string | null>(null); // State for image preview URL
	const { updateProfileImg } = useProfile();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setProfileImg(file);

			// Generate a URL for the selected file to use as image preview
			const previewUrl = URL.createObjectURL(file);
			setImgPreview(previewUrl);
		}
	};

	const loadProfile = async () => {
		if (token) {
			try {
				const response = await fetchProfile(token);

				const data = response.user;
				setProfile(data);
				setUsername(data.username || "");
				setBio(data.bio || "");
				setError(null);
			} catch (error) {
				setError("Error fetching profile: " + (error as Error).message);
			}
		} else {
			setError("No authentication token or user ID found");
		}
	};

	useEffect(() => {
		loadProfile();
	}, [token, user._id]);

	const handleUpdate = async () => {
		if (profile && token) {
			try {
				const updatedData = { username, bio };
				const updatedProfile = await updateProfile(
					profile._id,
					updatedData,
					token
				);
				setProfile(updatedProfile);
			} catch (error) {
				console.error("Error updating profile:", error);
			}
		}
	};

	const handleProfileImage = async () => {
		const url = await updateProfileImg(profileImg!);
		setProfile((prev) => {
			return { ...prev, profilePicture: url };
		});
		loadProfile();
	};

	if (!profile && !error) {
		return (
			<div className="max-w-4xl mx-auto mt-10 p-6 border rounded-md shadow-md">
				Loading...
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center mt-10 bg-gray-50">
			<div className="w-28 h-28 rounded-full overflow-hidden border-4">
				<Image
					src={profile.profilePicture || "/default-avatar.png"}
					alt="Profile Picture"
					className="w-full h-full object-cover"
				/>
			</div>
			<div className="border">
				<input
					type="file"
					onChange={handleFileChange}
					className="w-full p-2 border border-gray-300 rounded-md"
				/>

				{/* Display the uploaded image preview */}
				{imgPreview && (
					<div>
						<Image
							src={imgPreview}
							alt="Uploaded preview"
							width={300}
							height={400}
							className="rounded-full w-28 h-28"
						/>
						<button onClick={handleProfileImage}>Upload</button>
					</div>
				)}
			</div>
			{/* <div className="flex items-center justify-between w-full mt-4">
				<h2 className="text-2xl font-bold text-center text-gray-800">
					{profile.username}
				</h2>
				<button
					className="text-sm font-semibold text-blue-500 hover:text-blue-700"
					onClick={() => setEditMode(!editMode)}>
					{editMode ? "Cancel" : "Edit Profile"}
				</button>
			</div> */}
		</div>
	);
};

export default EditProfile;
