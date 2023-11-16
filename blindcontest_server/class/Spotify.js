// Importation de la bibliothèque Axios pour effectuer des requêtes HTTP
import axios from "axios";
// Importation de la classe io depuis le fichier index.js
import { io } from "../index.js";

// Clé et secret du client Spotify
const client_id = "57a56c9278bb47f39e8a7a6c8231cb0f";
const client_secret = "914a526426b64784baa8e4db285e1871";

// Définition de la classe Spotify
class Spotify {
    constructor() {
        // Création d'une instance Axios avec une URL de base pour les requêtes Spotify
        this.req = axios.create({
            baseURL: "https://api.spotify.com/v1/"
        });

        // Initialisation du jeton d'accès Spotify actuel
        this.currentToken = "";
    }

    // Méthode asynchrone pour définir le jeton d'accès Spotify
    async setToken() {
        // Requête pour obtenir un jeton d'accès Spotify en utilisant le mode client_credentials
        const req = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
        });

        // Analyse de la réponse JSON
        const res = await req.json();

        // Mise à jour du jeton d'accès actuel et des en-têtes par défaut d'Axios
        this.currentToken = `${res.token_type} ${res.access_token}`;
        this.req.defaults.headers = {
            "Authorization": this.currentToken
        };

        // Retourne le jeton d'accès
        return this.currentToken;
    }

    // Méthode pour actualiser périodiquement le jeton d'accès
    actualiseToken() {
        setInterval(async () => {
            // Appel de la méthode setToken pour obtenir un nouveau jeton
            const token = await this.setToken();
            // Émission de l'événement "token" avec le nouveau jeton aux clients via Socket.IO
            io.emit("token", { token: token });
        }, 3600000); // Actualisation toutes les heures (3600000 millisecondes)
    }

    // Méthode asynchrone pour obtenir les catégories Spotify
    async getCategories() {
        const res = await this.req.get("browse/categories");
        return await res.data.categories.items;
    }

    // Méthode asynchrone pour obtenir une playlist en fonction des catégories et du nombre de questions
    async getPlaylist(categories, nbrQuestion) {
        // Transformation des catégories en tableau de promesses
        categories = categories.map(async e => {
            // Requête pour obtenir la première playlist de la catégorie
            const categoriesPlaylists = await this.req.get(`browse/categories/${e}/playlists?limit=1`);
            
            // Transformation des playlists en tableau de promesses
            const categoriesLists = categoriesPlaylists.data.playlists.items.map(async e => {
                if (!e) return
                // Requête pour obtenir les pistes de la playlist
                const tracks = await this.req.get(`${e.tracks.href}?limit=20`);
                // Transformation des pistes en un tableau d'objets de données pertinentes
                return tracks.data.items.map(e => {
                    if (e.track.type == "track" && e.track.preview_url) return {
                        id: e.track.id,
                        name: e.track.name,
                        artists: e.track.artists.map(e => e.name),
                        href: e.track.preview_url,
                        image: e.track.album.images[0].url,
                        openSpotify: e.track.external_urls.spotify
                    };
                });
            });

            // Attente de toutes les promesses des listes de pistes
            return await Promise.all(categoriesLists);
        });

        // Initialisation d'un tableau pour stocker toutes les pistes
        const tracks = [];
        // Attente de toutes les promesses des catégories
        let playlists = await Promise.all(categories);
        // Fusion de tous les tableaux de pistes en un seul tableau
        playlists.map(a => {
            a.map(b => {
                b.map(e => {
                    tracks.push(e);
                });
            });
        });

        // Mélange aléatoire des pistes et sélection d'un nombre spécifié
        const shuffled = tracks.sort(() => 0.5 - Math.random());
        const list = shuffled.slice(0, nbrQuestion);
        
        // Retourne la liste de pistes
        return list;
    }
}

// Création d'une instance de la classe Spotify
const spotify = new Spotify();
// Appel initial de la méthode setToken pour définir le jeton d'accès
await spotify.setToken();
// Lancement de la méthode actualiseToken pour actualiser périodiquement le jeton d'accès
spotify.actualiseToken();

// Exportation de l'instance de la classe Spotify
export default spotify;
