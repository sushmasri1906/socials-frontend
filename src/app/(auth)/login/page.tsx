import Login from "@/Components/Authentication/Login";

const Page = () => {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="flex flex-col justify-center items-center min-h-screen">
				<div className="max-w-xs w-full bg-white border border-gray-300 p-8 shadow-sm rounded-md">
					<h2 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
						<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
							HexVibe
						</span>
					</h2>

					<Login />
				</div>
			</div>
		</div>
	);
};

export default Page;
