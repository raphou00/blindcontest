import io, { Socket } from "socket.io-client";

const server: string = "http://127.0.0.1:3000";
// const server: string = "http://10.205.201.214:3000";
// const server: string = "http://192.168.0.104:3000";

export const socket: Socket = io(server);