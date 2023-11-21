import { io } from "../index.js";
import RequestSpotify from "./Spotify.js";

export default class Room {
    started = false;
    time = 0;
    players = [];
    categories = [];
    nbrQuestions = 0;
    currentQuestion = 0;
    question = [];

    constructor(key) {
        this.key = key;
    }

    async setParams({time, nbrQuestions, categories}) {
        this.time = time;
        this.nbrQuestions = nbrQuestions;

        if (categories.length == 0) categories = (await RequestSpotify.getCategories()).map(e => e.id);
        this.categories = categories;

        this.question = await RequestSpotify.getPlaylist(this.categories, this.nbrQuestions);
    }

    start() {
        this.started = true;
        this.currentQuestion = 0;
        this.sendQuestion();
    }

    sendQuestion() {
        setTimeout(() => {
            this.playerSort();
            io.to(this.key).emit("answer_room", { answer: this.question[this.currentQuestion], players: this.players });
        }, this.time * 1000);
    }

    nextQuestion() {
        this.currentQuestion += 1;
        this.sendQuestion();
    }

    verifyAnswer(playerId, answerId) {
        for (const e of this.players) {
            if (e.id == playerId) {
                if (answerId == this.question[this.currentQuestion].id) {
                    e.point++;
                    return true;
                }
            }
        }

        return false;
    }

    playerSort() {
        this.players = this.players.sort((a, b) => b.point - a.point);
    }
    
    playerJoin(player) {
        this.players.push(player);
    }

    playerLeave(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }
}
