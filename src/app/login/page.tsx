import Login from "@/Components/Authentication/Login";
import Link from "next/link";

const Page = () => {
	return (
		<div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
			<Login />
		</div>
	);
};

export default Page;
