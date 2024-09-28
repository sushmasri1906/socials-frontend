// app/special-page/layout.tsx (Updated Layout for the special page)
export default function SpecialPageLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<main>{children}</main>
		</>
	);
}
