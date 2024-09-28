import Link from "next/link";
import React from "react";
import ALink from "./ALink";
import { BiSolidHome } from "react-icons/bi";
import { FaPlus, FaRegUserCircle, FaSearch } from "react-icons/fa";
import HandleAuth from "./HandleAuth";

const NavBar = () => {
	return (
		<div className="h-16">
			<div className="flex justify-between h-full bg-gray-200 p-4 px-2 items-center gap-x-4">
				<ALink href="/" text="Home" icon={<BiSolidHome />} />
				<ALink href="/search" text="Search" icon={<FaSearch />} />
				<ALink href="/posts" text="Posts" icon={<FaPlus />} />
				<ALink href="/profile" text="Profile" icon={<FaRegUserCircle />} />
				<div className="flex justify-center items-center">
					<HandleAuth />
				</div>
			</div>
		</div>
	);
};

export default NavBar;
