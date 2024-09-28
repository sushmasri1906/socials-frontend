"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useAuth } from "@/services/useAuth";

const Login = () => {
	const { login, error, success } = useAuth();
	const [formData, setFormData] = useState({
		email: "",
		password: "",
	}); // Manage login data
	const [showPassword, setShowPassword] = useState<boolean>(false);

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
				login(formData);
			} catch (err) {
				if (err instanceof Error) console.error(err);
				else console.error("unknown error");
			}
		} else {
		}
	};

	const togglePasswordVisibility = () => {
		setShowPassword((prevState) => !prevState);
	};

	return (
		<>
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
		</>
	);
};

export default Login;
