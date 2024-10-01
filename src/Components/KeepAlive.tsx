"use client";
import { useEffect } from "react";
import axios from "axios";

const KeepAlive: React.FC = () => {
	const sendPing = async () => {
		try {
			const response = await axios.get("https://hexvibe.onrender.com/ping");
			console.log("Ping response:", response.data); // Log the response
		} catch (error) {
			console.error(
				"Error sending ping:",
				error instanceof Error ? error.message : error
			);
		}
	};

	useEffect(() => {
		// Send an initial ping immediately when the component mounts
		sendPing();

		// Set the interval to send pings every 5 minutes
		const pingInterval = setInterval(sendPing, 5 * 60 * 1000);

		// Clear the interval when the component unmounts
		return () => clearInterval(pingInterval);
	}, []);

	return null; // This component doesn't render anything visible
};

export default KeepAlive;
