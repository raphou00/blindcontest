import { io } from "./socket.js";
import RequestSpotify from "./RequestSpotify.js";

export default class Room {
    constructor(key) {
        this.key = key;

        this.started = false;

        this.time = 0;

        this.players = [];

        this.categories = [];

        this.nbrQuestions = 0;
        this.currentQuestion = 0;
        this.question = [];
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
            io.to(this.key).emit("answer_room", { answer: this.question[this.currentQuestion] });
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


    playerJoin(player) {
        this.players.push(player);
    }

    playerLeave(player) {
        this.players.splice(this.players.indexOf(player), 1);
    }
}