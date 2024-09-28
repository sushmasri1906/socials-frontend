"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

function ALink({
	text,
	href,
	icon,
}: {
	text: string;
	href: string;
	icon: ReactNode;
}) {
	const path = usePathname();
	const isActive = () => path === href;
	return (
		<Link href={href}>
			<p
				className={`
					${
						isActive() ? " font-bold text-blue-500" : ""
					} + flex items-center gap-x-2 self-start`}>
				<span>{icon}</span>
				<span className=" hidden sm:block">{text}</span>
			</p>
		</Link>
	);
}

export default ALink;
