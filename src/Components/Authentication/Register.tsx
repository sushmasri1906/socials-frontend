"use client";
import { useState } from "react";
import { useAuth } from "@/services/useAuth";
import Link from "next/link";

const Register = () => {
	const { register, success, error } = useAuth();
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [localError, setLocalError] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setLocalError("Passwords do not match!");
			return;
		}

		await register({ username, email, password });
	};

	return (
		<>
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
						value={username}
						onChange={(e) => setUsername(e.target.value)}
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
						value={email}
						onChange={(e) => setEmail(e.target.value)}
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
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							onClick={() => setShowPassword((prev) => !prev)}
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
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							required
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
						/>
						<button
							type="button"
							onClick={() => setShowConfirmPassword((prev) => !prev)}
							className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600">
							{showConfirmPassword ? "Hide" : "Show"}
						</button>
					</div>
				</div>

				{localError && <p className="text-red-500 text-sm">{localError}</p>}
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
		</>
	);
};

export default Register;
