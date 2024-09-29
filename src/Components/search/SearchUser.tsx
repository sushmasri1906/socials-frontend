"use client";
import { useState, ChangeEvent, useEffect } from "react";
import { useRecoilState } from "recoil";
import { authTokenState } from "../../State/atoms";
import axios from "axios";
import { api } from "../../Constants/constants";
import { useRouter } from "next/navigation";
import { User } from "@/types/types";
import Image from "next/image";

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
			} catch (error) {
				if (error instanceof Error)
					setError("Error fetching users: " + error.message);
				else setError("Unknown Error occured while fetching user");
				console.error("Error fetching users:", error);
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
						{searchResults.map((user: User) => (
							<li
								key={user._id}
								className="mb-2 cursor-pointer"
								onClick={() => handleUserClick(user._id)}>
								<div className="flex items-center space-x-4">
									<Image
										src={user.profilePicture}
										alt="Profile"
										className="w-12 h-12 rounded-full"
										width={48}
										height={48}
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
