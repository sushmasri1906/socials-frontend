import Upload from "@/Components/post/Upload";
import React from "react";

function page() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
			<div className="bg-white shadow-md rounded-md w-full max-w-md p-6 space-y-4">
				<Upload />
			</div>
		</div>
	);
}

export default page;
