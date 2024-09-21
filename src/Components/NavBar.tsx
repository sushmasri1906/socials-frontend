import Link from "next/link";
import React from "react";

const NavBar = () => {
	return (
		<div>
			<div className="flex h-16 bg-gray-200 p-4 items-center gap-x-4">
				<Link href={"/"}>Home</Link>
				<Link href={"/search"}>Search</Link>
				<Link href={"/posts"}>Posts</Link>
				<Link href={"/profile"}>Profile</Link>
				<Link href={"/login"}>Login</Link>
			</div>
		</div>
	);
};

export default NavBar;
