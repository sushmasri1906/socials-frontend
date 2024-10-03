"use client";
import React, { useEffect, useState } from "react";
import { deleteProfile, fetchProfile } from "@/services/profileServices";
import { useRecoilValue } from "recoil";
import { authTokenState, userState } from "@/State/atoms";
import { User } from "@/types/types";
import Image from "next/image";

import { api } from "@/Constants/constants";
import { useRouter } from "next/navigation";

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
	const [imgPreview, setImgPreview] = useState<string | null>(null);
	const router = useRouter();

	const handleDelete = async () => {
		if (profile && token) {
			try {
				await deleteProfile(profile._id, token);
				router.push("/login");
			} catch (error) {
				console.error("Error deleting profile:", error);
			}
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			const file = e.target.files[0];
			setProfileImg(file);

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

	const handleProfileImage = async () => {
		if (!profileImg) return;

		// Create a FormData object
		const formData = new FormData();
		formData.append("file", profileImg);

		try {
			const response = await fetch(`${api}/user/profilepicture`, {
				method: "PUT",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formData,
			});

			const result = await response.json();
			if (response.ok) {
				console.log(result);
				loadProfile();
				setProfileImg(result.url);
				setImgPreview(null);
			} else {
				setError("Error updating profile picture");
			}
		} catch (error) {
			console.error("Error uploading post:", error);
		}
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
			{error && <p className="text-red-500">{error}....!</p>}
			<div>{username}</div>
			<div className="w-28 h-28 rounded-full overflow-hidden border-4">
				{imgPreview ? (
					<Image
						src={imgPreview}
						alt="Profile Picture"
						className="w-full h-full object-cover"
						width={112}
						height={112}
					/>
				) : (
					<Image
						src={profile.profilePicture}
						alt="Profile Picture"
						className="w-full h-full object-cover"
						width={112}
						height={112}
					/>
				)}
			</div>
			{imgPreview && (
				<button
					className="px-2 my-2 border rounded bg-blue-400"
					onClick={handleProfileImage}>
					Upload
				</button>
			)}
			<div className="border">
				<input
					type="file"
					onChange={handleFileChange}
					className="w-full p-2 border border-gray-300 rounded-md"
				/>
			</div>
			<div className="flex flex-col items-center gap-y-2">
				<h2 className="text-2xl font-bold">Bio</h2>
				{user.bio ? <p>{user.bio}</p> : <p>No bio!!!</p>}
				<textarea value={bio} onChange={(e) => setBio(e.target.value)} />
				{user.bio != bio && (
					<button className="px-2 my-2 border rounded bg-blue-400">
						update bio
					</button>
				)}
			</div>
			<div>
				<button
					className="bg-red-600 text-white px-4 py-2 rounded-lg mt-6 transition hover:bg-red-700"
					onClick={handleDelete}>
					Delete Profile
				</button>
			</div>
		</div>
	);
};

export default EditProfile;
