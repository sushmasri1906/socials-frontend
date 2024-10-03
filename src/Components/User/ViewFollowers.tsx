"use client";
import { api } from "@/Constants/constants";
import { authTokenState } from "@/State/atoms";
import { User } from "@/types/types";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

function ViewFollowers({
	userId,
	close,
}: {
	userId: string;
	close: () => void;
}) {
	const [followers, setFollowers] = useState([]);
	const token = useRecoilValue(authTokenState);
	const getFollowers = async () => {
		const response = await axios.get(`${api}/user/followers/${userId}`, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		setFollowers(response.data.followers);
	};
	useEffect(() => {
		getFollowers();
	}, []);
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg p-6 w-96">
				<h2 className="text-xl font-semibold mb-4">Followers</h2>
				<ul className="divide-y">
					{followers.length > 0 ? (
						followers.map((follower: User) => (
							<li key={follower._id} className="py-2 flex items-center">
								<Image
									src={follower.profilePicture}
									alt={follower.username}
									className="w-10 h-10 rounded-full border mr-2"
									width={40}
									height={40}
								/>
								<span className="font-medium">{follower.username}</span>
							</li>
						))
					) : (
						<p>No followers yet.</p>
					)}
				</ul>
				<button className="mt-4 text-blue-500" onClick={close}>
					Close
				</button>
			</div>
		</div>
	);
}

export default ViewFollowers;
