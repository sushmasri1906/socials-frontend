import SearchUser from "@/Components/search/SearchUser";
import React from "react";

function page() {
	return (
		<div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
			<h2 className="text-2xl font-bold mb-4">Search Users</h2>
			<SearchUser />
		</div>
	);
}

export default page;
