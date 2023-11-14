import axios, { AxiosInstance, AxiosResponse } from "axios";
import socket from "./socket";

const spotifyApi: AxiosInstance = axios.create({
    baseURL: "https://api.spotify.com/v1/",
});

socket.emit("token");
socket.on("token", data => {    
    spotifyApi.defaults.headers["Authorization"] = data.token;
});

export const searchSongs = async (search: string): Promise<any[]> => {
    const list: any[] = [];

    const res: AxiosResponse = await spotifyApi.get(`search?q=${search}&type=track&limit=5`);
    
    res.data.tracks.items.map((e: any) => {
        list.push({
            id: e.id,
            title: e.name,
            artists: e.artists.map((e: any) => e.name),
            image: e.album.images[0].url
        });
    });
    
    return list;
};