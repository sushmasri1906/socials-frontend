"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authTokenState } from "../../State/atoms";
import axios from "axios";
import { api } from "../../Constants/constants";
import { useRouter } from "next/navigation";
import { User } from "@/types/types";

const SearchUser = () => {
	const [query, setQuery] = useState<string>("");
	const [searchResults, setSearchResults] = useState<User[] | []>([]);
	const [authToken] = useRecoilState(authTokenState);
	const [error, setError] = useState<string | null>(null);
	const router = useRouter();

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setQuery(e.target.value);
	};

	const handleSubmit = async () => {
		if (query.trim()) {
			try {
				const response = await axios.get(`${api}/user/users`, {
					params: { username: query },
					headers: {
						Authorization: `Bearer ${authToken}`,
					},
				});
				setSearchResults(response.data);
				setError(null);
			} catch (error: any) {
				console.error("Error fetching users:", error);
				setError("Error fetching users: " + error.message);
				setSearchResults([]);
			}
		} else {
			setSearchResults([]);
		}
	};

	const handleUserClick = (userId: string) => {
		router.push(`/user/${userId}`);
	};

	useEffect(() => {
		handleSubmit();
	}, [query]);

	return (
		<>
			<div>
				<input
					type="text"
					value={query}
					onChange={handleChange}
					placeholder="Search by username"
					className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4"
				/>
				<button
					onClick={handleSubmit}
					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">
					Search
				</button>
			</div>
			{error && <p className="text-red-500 text-sm">{error}</p>}
			<div className="mt-6">
				{searchResults.length > 0 ? (
					<ul>
						{searchResults.map((user: any) => (
							<li
								key={user._id}
								className="mb-2 cursor-pointer"
								onClick={() => handleUserClick(user._id)}>
								<div className="flex items-center space-x-4">
									<img
										src={user.profilePicture || "/default-profile.jpg"}
										alt="Profile"
										className="w-12 h-12 rounded-full"
									/>
									<div>
										<p className="font-medium">{user.username}</p>
										<p className="text-gray-600">{user.email}</p>
									</div>
								</div>
							</li>
						))}
					</ul>
				) : (
					<p>No users found.</p>
				)}
			</div>
		</>
	);
};

export default SearchUser;
