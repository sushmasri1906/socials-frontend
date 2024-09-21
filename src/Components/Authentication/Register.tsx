"use client";
import { useState } from "react";
import { registerUser } from "../../services/authServices";
import Image from "next/image";

import Link from "next/link";

const Register = () => {
	const [formData, setFormData] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleChange = (e: { target: { name: any; value: any } }) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match!");
			return;
		}

		try {
			await registerUser(formData);
			setSuccess(true);
			setError("");
		} catch (err) {
			setError("Registration failed. Please try again.");
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword((prevState) => !prevState);
	};

	return (
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

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="mb-4">
						<label
							htmlFor="username"
							className="block text-sm font-medium text-gray-700">
							Username
						</label>
						<input
							type="text"
							id="username"
							name="username"
							value={formData.username}
							onChange={handleChange}
							required
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700">
							Email
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={formData.email}
							onChange={handleChange}
							required
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700">
							Password
						</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								id="password"
								name="password"
								value={formData.password}
								onChange={handleChange}
								required
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={togglePasswordVisibility}
								className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700">
							Confirm Password
						</label>
						<div className="relative">
							<input
								type={showConfirmPassword ? "text" : "password"}
								id="confirmPassword"
								name="confirmPassword"
								value={formData.confirmPassword}
								onChange={handleChange}
								required
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
							<button
								type="button"
								onClick={toggleConfirmPasswordVisibility}
								className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
								{showConfirmPassword ? "Hide" : "Show"}
							</button>
						</div>
					</div>

					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && (
						<p className="text-green-500 text-sm">Registration successful!</p>
					)}

					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 px-4 rounded-md text-sm font-semibold hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
						Register
					</button>
				</form>

				<div className="mt-6 text-center">
					<p className="text-sm text-gray-500">
						Already have an account?{" "}
						<Link
							href="/login"
							className="text-blue-500 font-semibold hover:underline">
							Log in
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default Register;
