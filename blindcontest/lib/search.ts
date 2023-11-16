import axios, { AxiosInstance, AxiosResponse } from "axios";
import socket from "./socket";

// Création d'une instance Axios pour l'API Spotify
const spotifyApi: AxiosInstance = axios.create({
    baseURL: "https://api.spotify.com/v1/",
});

// Émission de l'événement "token" au serveur pour obtenir le jeton d'authentification
socket.emit("token");

// Écoute de l'événement "token" pour recevoir le jeton d'authentification et le configurer dans les headers de l'instance Axios
socket.on("token", (data) => {
    spotifyApi.defaults.headers["Authorization"] = data.token;
});

// Fonction pour effectuer une recherche de chansons sur Spotify
export const searchSongs = async (search: string): Promise<any[]> => {
    // Tableau pour stocker les résultats de la recherche
    const list: any[] = [];

    // Appel à l'API Spotify pour effectuer la recherche
    const res: AxiosResponse = await spotifyApi.get(`search?q=${search}&type=track&limit=5`);

    // Mapping des résultats de la recherche pour créer un tableau normalisé
    res.data.tracks.items.map((e: any) => {
        list.push({
            id: e.id,
            title: e.name,
            artists: e.artists.map((e: any) => e.name),
            image: e.album.images[0].url,
        });
    });

    // Retour du tableau de résultats
    return list;
};
