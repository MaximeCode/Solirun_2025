import { io } from "socket.io-client";

const SOCKET_URL = "http://10.37.127.10:5000";
export const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });