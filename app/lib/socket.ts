import io, { Socket } from "socket.io-client";

const server: string = "http://162.19.243.4:3001";
const socket: Socket = io(server);

export default socket;