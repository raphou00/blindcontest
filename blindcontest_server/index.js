// Importation des modules nécessaires
import express from "express";
import cors from "cors";
import { Server } from "http";
import { Server as Socket } from "socket.io";

// Importation des classes personnalisées (Spotify et Room)
import Spotify from "./class/Spotify.js";
import Room from "./class/Room.js";

// Création de l'application Express
export const app = express();

// Création du serveur HTTP avec l'application Express
export const server = new Server(app);

// Configuration de Socket.io avec le serveur
export const io = new Socket(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware pour activer CORS
app.use(cors());

// Tableau pour stocker les salles de jeu
export const rooms = [];

// Fonction pour obtenir la liste des joueurs dans une salle
const getPlayersRoom = room => {
    for (const e of rooms) {
        if (e.key == room) {
            e.playerSort();
            return e.players;
        }
    }
}

// Fonction pour générer une clé aléatoire unique
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

// Gestion des connexions WebSocket
io.on("connection", socket => {

    // Écouteur pour l'événement "token"
    socket.on("token", () => {
        // Émission du token Spotify actuel à tous les clients connectés
        io.emit("token", { token: Spotify.currentToken });
    });

    // Écouteur pour l'événement "categories"
    socket.on("categories", async () => {
        // Émission des catégories Spotify disponibles à un client spécifique
        io.to(socket.id).emit("categories", { categories: await Spotify.getCategories() });
    });

    // Écouteur pour l'événement "check_key"
    socket.on("check_key", data => {
        const { room } = data;
        const res = { access: false, key: room };

        for (const e of rooms) {
            if (room == e.key && !e.started) res.access = true;
        }
        
        // Émission de la réponse à un client spécifique
        io.to(socket.id).emit("check_key", { ...res });
    });

    // Écouteur pour l'événement "players"
    socket.on("players", async data => {
        // Émission de la liste des joueurs dans une salle à un client spécifique
        io.to(socket.id).emit("players", { players: getPlayersRoom(data.room) });
    });

    // Écouteur pour l'événement "disconnect"
    socket.on("disconnect", async () => {
        // Gestion de la déconnexion d'un client
        socket.leave(socket.room);

        for (const e of rooms) {
            if (e.key == socket.room) {
                for (const p of e.players) {
                    if (p.id == socket.id) e.players.splice(e.players.indexOf(p), 1);
                }
            }
        }

        // Émission de la mise à jour de la liste des joueurs à tous les clients dans la salle
        io.to(socket.room).emit("players", { players: getPlayersRoom(socket.room) });
    });

    // Écouteur pour l'événement "join_lobby"
    socket.on("join_lobby", data => {
        // Gestion de la connexion d'un client au lobby
        socket.room = data.room;
        socket.join(data.room);
    });

    // Écouteur pour l'événement "join_room"
    socket.on("join_room", async data => {
        // Gestion de la connexion d'un client à une salle de jeu
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

        // Émission de la mise à jour de la liste des joueurs à tous les clients dans la salle
        io.to(socket.room).emit("players", { players: getPlayersRoom(data.room) });
    });

    // Écouteur pour l'événement "create_room"
    socket.on("create_room", () => {
        // Création d'une nouvelle salle de jeu avec une clé aléatoire
        const key = randomKey();
        const newRoom = new Room(key);
        rooms.push(newRoom);

        // Émission de la clé de la nouvelle salle au client spécifique
        io.to(socket.id).emit("create_room", { key: key });
    });

    // Écouteur pour l'événement "update_room"
    socket.on("update_room", async (data, callback) => {
        // Mise à jour des paramètres d'une salle de jeu spécifique
        for (const e of rooms) {
            if (e.key == data.key) {
                await e.setParams({
                    time: data.time,
                    nbrQuestions: data.nbrQuestions,
                    categories: data.categories,
                });
            }
        }

        // Appel du rappel (callback)
        callback();
    });

    // Écouteur pour l'événement "start_room"
    socket.on("start_room", () => {
        // Démarrage d'une salle de jeu spécifique
        for (const e of rooms) {
            if (e.key == socket.room) {
                e.start();
                // Émission de l'événement "start_room" à tous les clients dans la salle
                io.to(e.key).emit("start_room", { name: e.players.find(e => e.id == socket.id).name });
            }
        }
    });

    // Écouteur pour l'événement "audio_room"
    socket.on("audio_room", () => {
        // Gestion de la lecture audio dans une salle de jeu
        for (const e of rooms) {
            if (e.key == socket.room) {
                if (e.currentQuestion == e.nbrQuestions) {
                    // Si toutes les questions ont été posées, émettre l'événement "results_room"
                    io.to(socket.room).emit("results_room", { room: socket.room });
                } else {
                    // Sinon, émettre l'événement "audio_room" avec l'audio de la question actuelle
                    io.to(socket.room).emit("audio_room", { audio: e.question[e.currentQuestion].href, time: e.time, cheat: e.question[e.currentQuestion] });
                }
            }
        }
    });

    // Écouteur pour l'événement "answer_room"
    socket.on("answer_room", (data, callback) => {
        let answer = false;
        // Vérification de la réponse à une question dans une salle de jeu spécifique
        for (const e of rooms) {
            if (e.key == socket.room) {
                answer = e.verifyAnswer(socket.id, data.id);
            }
        }

        // Appel du rappel (callback) avec la réponse
        callback({correct: answer});
    });

    // Écouteur pour l'événement "next_room"
    socket.on("next_room", (callback) => {
        // Passage à la question suivante dans une salle de jeu spécifique
        for (const e of rooms) {
            if (e.key == socket.room) {
                e.nextQuestion();
                // Émission de l'événement "next_room" à tous les clients dans la salle
                io.to(socket.room).emit("next_room");
            }
        }

        // Appel du rappel (callback)
        callback();
    });

    // Écouteur pour l'événement "delete_room"
    socket.on("delete_room", data => {
        // Suppression d'une salle de jeu spécifique
        for (const e of rooms) {
            if (e.key == data.room) {
                rooms.splice(rooms.indexOf(e), 1);
            }
        }
    });

});

// Démarrage du serveur sur le port 3000
server.listen(3000, () => console.log("http://127.0.0.1:3000"));
