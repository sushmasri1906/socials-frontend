import Register from "@/Components/Authentication/Register";

const Page = () => {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
				<div className="w-full max-w-sm p-8 bg-white border border-gray-200 rounded-lg shadow-lg">
					<div className="text-center mb-6">
						<h2 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
							<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
								HexVibe
							</span>
						</h2>
						<h2 className="text-3xl font-semibold text-gray-800 mt-4">
							Create an Account
						</h2>
					</div>
					<Register />
				</div>
			</div>
		</div>
	);
};

export default Page;
