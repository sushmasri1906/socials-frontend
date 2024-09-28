"use client";
import { IoMdLogIn, IoMdLogOut } from "react-icons/io";
import ALink from "./ALink";
import { useAuth } from "@/services/useAuth";

export default function AuthComponent() {
	const { logout, token } = useAuth();

	return (
		<div>
			{token ? (
				<button onClick={logout} className="flex items-center gap-x-2">
					<IoMdLogOut />
					<span className=" hidden sm:block">Logout</span>
				</button>
			) : (
				<div>
					<ALink text="login" href="/login" icon={<IoMdLogIn />} />
				</div>
			)}
		</div>
	);
}
