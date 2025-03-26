"use client";

import "./globals.css";
import { socket } from "../utils/socket";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Script from "next/script";

export default function RootLayout({ children }) {
	const [isConnected, setIsConnected] = useState(socket.connected);

	useEffect(() => {
		function onConnect() {
			setIsConnected(true);
		}

		function onDisconnect() {
			setIsConnected(false);
		}

		return () => {
			socket.off("connect", onConnect);
			socket.off("disconnect", onDisconnect);
		};
	}, []);

	return (
		<html
			lang="en"
			data-theme="fantasy"
		>
			<body className="h-full">
				<main>{children}</main>
				{/* Confettis pour la page Podium */}
				<Script
					data-trigger="custom"
					src="https://run.confettipage.com/here.js"
					data-confetticode="U2FsdGVkX1/noqjkqzaOZ6lerQtWRdUQFYcNPvjw2PwcI2PDuWKQ07LNPsY3DmGHaGxHUDLwo1YrDYDMOz2sR2fDor1Xy4IoaHeBeJ8+qvERPM6SVABSMZklfkK6MwpS+i32Vg5Lm5iUOt9diI4rZqWVFRmbsRY7I888PM2ExEmGF/ogZe09rE33C8PQFQrrU3vupBpf09l88ccNRGli2J4Qu44dOk2lyC5LWbwhFxpf3nclqK0mEqjJAFgyWA5uHTJWjo9MluwknqqdxIzJTmLYZJ+LlrbiV50o/YTc5HjV7IKa5ksVd3JAPO5P9R67i7w7FuZ2Ab3ww48sLjCD++3rFxBvj+tnbzqYuPSROXfahdv0YVz5GcnZldsDG3PAvDF9zZrhuyH7rdrqpnDQOvqKlBNyZ3WogNByKB1kMc4qoUBSY/YlnRAH3CWG7s9vJG6YNpwas9y7QAHKrU6S0y3eNVtWmuZlnOh7LmrNx6HtK4ZVO/uJfisUwXFHoJDPl9UAWJXqO40EsJk3mBc+Iz0t9plkRBAuA+xyJx3amTGX1N/BVWoa/gNZ3Kxheftk0CjgFWiobWLMCUGAokSMPqVHA63H66c3UrkFPc/PigLzdJvnpe4n5VQNGxvFW8aKybGylPLDmWkOD0hBk0oRYpLXCN9xdktVUuPCBOEotYDzVodStnK12re/DXBN3Ci6lbXx9wwth/PU/wYSQjDH7+J4jwROMQPWYheyr1ecr5SiH019T5wIdlUd0kA2PX6K"
					strategy="afterInteractive"
				></Script>
			</body>
		</html>
	);
}

RootLayout.propTypes = {
	children: PropTypes.node.isRequired,
};
