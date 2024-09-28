"use client";
import { ReactNode } from "react";
import { RecoilRoot } from "recoil";

interface ProvidersProps {
	children: ReactNode;
}

const Providers = ({ children }: ProvidersProps) => {
	return <RecoilRoot>{children}</RecoilRoot>;
};

export default Providers;
