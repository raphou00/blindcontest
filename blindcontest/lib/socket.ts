// Importation de la bibliothèque Socket.io-client
import io, { Socket } from "socket.io-client";

// Définition de l'URL du serveur Socket.io
// Utilisation de l'adresse IP locale pour la connexion au serveur sur le même réseau
// const server: string = "http://127.0.0.1:3000";
const server: string = "http://192.168.0.101:3000";

// Création d'une instance de Socket.io avec l'URL du serveur
const socket: Socket = io(server);

// Exportation de l'instance de socket pour une utilisation dans d'autres fichiers
export default socket;
