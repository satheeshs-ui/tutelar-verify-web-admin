import { io } from "socket.io-client";
import constants from "./utils/config";

const URL =
    window.location.protocol === "https:"
        ? "wss://" + constants.S3_UPLOADER.VITE_SOCKET_URL
        : "wss://" + constants.S3_UPLOADER.VITE_SOCKET_URL;

const socket = io(URL, {
    // transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    autoConnect: false,
    path: "/socket.io",
});

let initialized = false;

export function initSocket() {
    if (!initialized) {
        socket.connect();
        initialized = true;
    }
    return socket;
}

export default socket;
