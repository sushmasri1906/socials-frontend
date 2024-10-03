// Spinner.tsx
const Spinner = () => (
	<div className="flex justify-center items-center">
		<div className="loader"></div>
		<style jsx>{`
			.loader {
				border: 8px solid rgba(0, 0, 0, 0.1);
				border-left-color: #3b82f6; /* Tailwind's blue-500 */
				border-radius: 50%;
				width: 40px;
				height: 40px;
				animation: spin 1s linear infinite;
			}
			@keyframes spin {
				to {
					transform: rotate(360deg);
				}
			}
		`}</style>
	</div>
);

// Export the Spinner component
export default Spinner;
