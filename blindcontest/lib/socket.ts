import io, { Socket } from "socket.io-client";

const server: string = "http://127.0.0.1:3000";
// const server: string = "http://192.168.0.103:3000";

const socket: Socket = io(server);

export default socket;