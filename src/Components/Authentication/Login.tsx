// "use client";
// import { useState, ChangeEvent, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import { loginUser } from "../../services/authServices";
// import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
// import { authTokenState, loginDataState, userIdState } from "../../State/atoms";
// import { saveToken } from "../../Utils/tokenUtils";

// const Login = () => {
// 	const [formData, setFormData] = useRecoilState(loginDataState); // Manage login data
// 	const [authToken, setAuthToken] = useRecoilState(authTokenState); // Manage token
// 	const [error, setError] = useState<string | null>(null);
// 	const [success, setSuccess] = useState<string | null>(null); // Success message state
// 	const [showPassword, setShowPassword] = useState<boolean>(false);
// 	const router = useRouter();
// 	const setCurrentUserId = useSetRecoilState(userIdState);
// 	const currentId = useRecoilValue(userIdState);

// 	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
// 		const { name, value } = e.target;
// 		setFormData((prevData) => ({
// 			...prevData!,
// 			[name as keyof typeof prevData]: value,
// 		}));
// 	};

// 	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
// 		e.preventDefault();

// 		if (formData && formData.email && formData.password) {
// 			try {
// 				const response = await loginUser(formData);
// 				const token = response.token;
// 				setAuthToken(token); // Update Recoil state
// 				saveToken(token); // Save token to local storage
// 				setError(null);
// 				console.log(response);
// 				setCurrentUserId(response.userId);
// 				console.log(currentId);

// 				setSuccess("Login successful! Redirecting...");

// 				// Redirect to home page
// 				setTimeout(() => {
// 					router.push("/"); // Redirect to home page
// 				}, 100); // Delay to show the success message
// 			} catch (err: any) {
// 				setError("Invalid credentials. Please try again.");
// 				setSuccess(null); // Clear success message if there's an error
// 			}
// 		} else {
// 			setError("Please fill in both email and password.");
// 			setSuccess(null); // Clear success message if there's an error
// 		}
// 	};

// 	const togglePasswordVisibility = () => {
// 		setShowPassword((prevState) => !prevState);
// 	};

// 	return (
// 		<div className="max-w-md mx-auto mt-10 p-6 border rounded-md shadow-md">
// 			<h2 className="text-2xl font-bold mb-4">Login to Your Account</h2>
// 			<form onSubmit={handleSubmit}>
// 				<div className="mb-4">
// 					<label
// 						htmlFor="email"
// 						className="block text-sm font-medium text-gray-700">
// 						Email
// 					</label>
// 					<input
// 						type="email"
// 						id="email"
// 						name="email"
// 						value={formData?.email || ""}
// 						onChange={handleChange}
// 						required
// 						className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
// 					/>
// 				</div>
// 				<div className="mb-4">
// 					<label
// 						htmlFor="password"
// 						className="block text-sm font-medium text-gray-700">
// 						Password
// 					</label>
// 					<div className="relative">
// 						<input
// 							type={showPassword ? "text" : "password"}
// 							id="password"
// 							name="password"
// 							value={formData?.password || ""}
// 							onChange={handleChange}
// 							required
// 							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm"
// 						/>
// 						<button
// 							type="button"
// 							onClick={togglePasswordVisibility}
// 							className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
// 							{showPassword ? "Hide" : "Show"}
// 						</button>
// 					</div>
// 				</div>
// 				{error && <p className="text-red-500 text-sm">{error}</p>}
// 				{success && <p className="text-green-500 text-sm">{success}</p>}
// 				<button
// 					type="submit"
// 					className="w-full bg-blue-500 text-white py-2 px-4 rounded-md">
// 					Login
// 				</button>
// 			</form>
// 		</div>
// 	);
// };

// export default Login;
"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/authServices";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { authTokenState, loginDataState, userIdState } from "../../State/atoms";
import { saveToken } from "../../Utils/tokenUtils";
import Link from "next/link";

const Login = () => {
	const [formData, setFormData] = useRecoilState(loginDataState); // Manage login data
	const [authToken, setAuthToken] = useRecoilState(authTokenState); // Manage token
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null); // Success message state
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const router = useRouter(); // Hook for navigation
	const setCurrentUserId = useSetRecoilState(userIdState);
	const currentId = useRecoilValue(userIdState);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData!,
			[name as keyof typeof prevData]: value,
		}));
	};

	const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (formData && formData.email && formData.password) {
			try {
				const response = await loginUser(formData);
				const token = response.token;
				setAuthToken(token); // Update Recoil state
				saveToken(token); // Save token to local storage
				setError(null);
				setCurrentUserId(response.userId);

				setSuccess("Login successful! Redirecting...");

				// Redirect to home page
				setTimeout(() => {
					router.push("/"); // Redirect to home page
				}, 100); // Delay to show the success message
			} catch (err: any) {
				setError("Invalid credentials. Please try again.");
				setSuccess(null); // Clear success message if there's an error
			}
		} else {
			setError("Please fill in both email and password.");
			setSuccess(null); // Clear success message if there's an error
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
			<div className="max-w-xs w-full bg-white border border-gray-300 p-8 shadow-sm rounded-md">
				<h2 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
					<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
						HexVibe
					</span>
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<input
							type="email"
							name="email"
							placeholder="Email"
							value={formData?.email || ""}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
						/>
					</div>
					<div className="relative">
						<input
							type={showPassword ? "text" : "password"}
							name="password"
							placeholder="Password"
							value={formData?.password || ""}
							onChange={handleChange}
							required
							className="w-full px-4 py-2 border rounded-md text-sm bg-gray-50 focus:outline-none focus:ring-1 focus:ring-gray-300"
						/>
						<button
							type="button"
							onClick={togglePasswordVisibility}
							className="absolute inset-y-0 right-0 px-4 py-2 text-sm text-gray-500">
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-500 text-sm">{success}</p>}
					<button
						type="submit"
						className="w-full py-2 text-white bg-blue-500 rounded-md text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
						Log In
					</button>
				</form>

				<div className="flex justify-center items-center mt-4">
					<div className="text-sm text-gray-500">OR</div>
				</div>

				<div className="flex justify-center mt-4">
					<button className="text-sm text-blue-500 font-semibold">
						Log in with Facebook
					</button>
				</div>

				<div className="flex justify-center items-center mt-6 border-t border-gray-300 pt-4">
					<p className="text-sm">
						Don't have an account?{" "}
						<Link
							href="/register"
							className="text-blue-500 font-semibold hover:underline">
							register
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
