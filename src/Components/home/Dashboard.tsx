import React from "react";
import Posts from "./Posts";

const Dashboard = () => {
	return (
		<div>
			<div className="flex items-center h-16 px-2 w-full sm:hidden">
				<h2 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
					<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
						HexVibe
					</span>
				</h2>
			</div>
			<Posts />
		</div>
	);
};

export default Dashboard;
