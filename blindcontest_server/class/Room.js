// Importation de la classe io depuis le fichier index.js
import { io } from "../index.js";
// Importation de la classe RequestSpotify pour effectuer des requêtes Spotify
import RequestSpotify from "./Spotify.js";

// Définition de la classe Room
export default class Room {
    // Propriétés de la classe Room
    started = false;
    time = 0;
    players = [];
    categories = [];
    nbrQuestions = 0;
    currentQuestion = 0;
    question = [];

    // Constructeur de la classe Room, prend une clé en paramètre
    constructor(key) {
        this.key = key;
    }

    // Méthode asynchrone pour définir les paramètres de la salle (temps, nombre de questions, catégories)
    async setParams({time, nbrQuestions, categories}) {
        this.time = time;
        this.nbrQuestions = nbrQuestions;

        // Si aucune catégorie n'est spécifiée, obtenir toutes les catégories disponibles depuis Spotify
        if (categories.length == 0) categories = (await RequestSpotify.getCategories()).map(e => e.id);
        this.categories = categories;

        // Obtenir la playlist en fonction des catégories et du nombre de questions
        this.question = await RequestSpotify.getPlaylist(this.categories, this.nbrQuestions);
    }

    // Méthode pour démarrer la salle de jeu
    start() {
        this.started = true;
        this.currentQuestion = 0;
        this.sendQuestion();
    }

    // Méthode pour envoyer une question aux joueurs après un délai
    sendQuestion() {
        setTimeout(() => {
            // Tri des joueurs par points (du plus au moins élevé)
            this.playerSort();
            // Émission de l'événement "answer_room" avec la réponse à la question actuelle et la liste des joueurs
            io.to(this.key).emit("answer_room", { answer: this.question[this.currentQuestion], players: this.players });
        }, this.time * 1000);
    }

    // Méthode pour passer à la question suivante
    nextQuestion() {
        this.currentQuestion += 1;
        this.sendQuestion();
    }

    // Méthode pour vérifier la réponse d'un joueur
    verifyAnswer(playerId, answerId) {
        for (const e of this.players) {
            if (e.id == playerId) {
                // Si l'ID de réponse correspond à l'ID de la réponse actuelle, le joueur a répondu correctement
                if (answerId == this.question[this.currentQuestion].id) {
                    e.point++;
                    return true;
                }
            }
        }

        // Le joueur a répondu incorrectement
        return false;
    }

    // Méthode pour trier les joueurs par points (du plus au moins élevé)
    playerSort() {
        this.players = this.players.sort((a, b) => b.point - a.point);
    }

    // Méthode pour ajouter un joueur à la liste des joueurs de la salle
    playerJoin(player) {
        this.players.push(player);
    }

    // Méthode pour retirer un joueur de la liste des joueurs de la salle
    playerLeave(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }
}
