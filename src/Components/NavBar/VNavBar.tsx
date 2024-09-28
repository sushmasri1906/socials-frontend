import React from "react";
import ALink from "./ALink";
import { FaPlus, FaRegUserCircle, FaSearch } from "react-icons/fa";
import { BiSolidHome } from "react-icons/bi";
import HandleAuth from "./HandleAuth";
import { MdMessage } from "react-icons/md";

const NavBar = () => {
	return (
		<div className="h-full w-full border-r border-gray-300">
			<div className="h-16 flex justify-center items-center">
				<h2 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
					<span className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-transparent bg-clip-text">
						HexVibe
					</span>
				</h2>
			</div>
			<div className="flex justify-center h-5/6">
				<div className="flex flex-col p-4 items-start w-fit gap-y-8">
					<ALink href="/" text="Home" icon={<BiSolidHome />} />
					<ALink href="/search" text="Search" icon={<FaSearch />} />
					<ALink href="/posts" text="Posts" icon={<FaPlus />} />
					<ALink href="/messages" text="Messages" icon={<MdMessage />} />
					<ALink href="/profile" text="Profile" icon={<FaRegUserCircle />} />
				</div>
			</div>
			<div className="flex justify-center items-center">
				<HandleAuth />
			</div>
		</div>
	);
};

export default NavBar;
