import express from "express";
import cors from "cors";
import { Server } from "http";
import { Server as Socket } from "socket.io";

import Spotify from "./class/Spotify.js";
import Room from "./class/Room.js";

export const app = express();
export const server = new Server(app);
export const io = new Socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

app.use(cors());

export const rooms = [];

const getPlayersRoom = room => {
    for (const e of rooms) {
        if (e.key == room) {
            e.playerSort();
            return e.players;
        }
    }
}

const randomKey = () => {
    let done = false;

    while (!done) {
        let key = "";
        for (let i = 0; i < 5; i++) key += Math.floor(Math.random() * 9);

        if (!(rooms.map(e => e.key)).includes(key)) {
            done = true;
            return key;
        }
    }
}

io.on("connection", socket => {
    socket.on("token", () => {
        io.emit("token", { token: Spotify.currentToken });
    });
    
    socket.on("categories", async () => {
        
        io.to(socket.id).emit("categories", { categories: await Spotify.getCategories() });
    });
    
    socket.on("check_key", data => {
        const { room } = data;
        const res = { access: false, key: room };

        for (const e of rooms) {
            if (room == e.key && !e.started) res.access = true;
        }
        
        io.to(socket.id).emit("check_key", { ...res });
    });
    
    socket.on("players", async data => {
        io.to(socket.id).emit("players", { players: getPlayersRoom(data.room) });
    });
    
    socket.on("disconnect", async () => {
        socket.leave(socket.room);

        for (const e of rooms) {
            if (e.key == socket.room) {
                for (const p of e.players) {
                    if (p.id == socket.id) e.players.splice(e.players.indexOf(p), 1);
                }
            }
        }
        
        io.to(socket.room).emit("players", { players: getPlayersRoom(socket.room) });
    });
    
    socket.on("join_lobby", data => {
        socket.room = data.room;
        socket.join(data.room);
    });

    
    socket.on("join_room", async data => {
        socket.name = data.name;

        for (const e of rooms) {
            if (e.key == data.room) {
                e.players.push({
                    id: socket.id,
                    name: data.name,
                    point: 0,
                });
            }
        }
        
        io.to(socket.room).emit("players", { players: getPlayersRoom(data.room) });
    });
    
    socket.on("create_room", () => {
        const key = randomKey();
        const newRoom = new Room(key);
        rooms.push(newRoom);
        
        io.to(socket.id).emit("create_room", { key: key });
    });
    
    socket.on("update_room", async (data, callback) => {
        for (const e of rooms) {
            if (e.key == data.key) {
                await e.setParams({
                    time: data.time,
                    nbrQuestions: data.nbrQuestions,
                    categories: data.categories,
                });
            }
        }
        
        callback();
    });
    
    socket.on("start_room", () => {
        for (const e of rooms) {
            if (e.key == socket.room) {
                e.start();
                io.to(e.key).emit("start_room", { name: e.players.find(e => e.id == socket.id).name });
            }
        }
    });
    
    socket.on("audio_room", () => {
        for (const e of rooms) {
            if (e.key == socket.room) {
                if (e.currentQuestion == e.nbrQuestions) {
                    io.to(socket.room).emit("results_room", { room: socket.room });
                } else {
                    io.to(socket.room).emit("audio_room", { audio: e.question[e.currentQuestion].href, time: e.time, cheat: e.question[e.currentQuestion] });
                }
            }
        }
    });
    
    socket.on("answer_room", (data, callback) => {
        let answer = false;
        
        for (const e of rooms) {
            if (e.key == socket.room) {
                answer = e.verifyAnswer(socket.id, data.id);
            }
        }

        
        callback({correct: answer});
    });
    
    socket.on("next_room", (callback) => {
        for (const e of rooms) {
            if (e.key == socket.room) {
                e.nextQuestion();
                io.to(socket.room).emit("next_room");
            }
        }
        
        callback();
    });
    
    socket.on("delete_room", data => {
        for (const e of rooms) {
            if (e.key == data.room) {
                rooms.splice(rooms.indexOf(e), 1);
            }
        }
    });
});

server.listen(3000);