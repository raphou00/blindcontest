import axios from "axios";
import { io } from "./socket.js";

const client_id = "57a56c9278bb47f39e8a7a6c8231cb0f";
const client_secret = "914a526426b64784baa8e4db285e1871";

class RequestSpotify {
    constructor() {
        this.req = axios.create({
            baseURL: "https://api.spotify.com/v1/"
        });

        this.currentToken = "";
    }

    async setToken() {
        const req = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: `grant_type=client_credentials&client_id=${client_id}&client_secret=${client_secret}`
        });

        const res = await req.json();

        this.currentToken = `${res.token_type} ${res.access_token}`;
        this.req.defaults.headers = {
            "Authorization": this.currentToken
        };

        return this.currentToken;
    }

    actualiseToken() {
        setInterval(async () => {
            const token = await this.setToken();
            io.emit("token", { token: token });
        }, 3600000);
    }

    async getCategories() {
        const res = await this.req.get("browse/categories");
        return await res.data.categories.items;
    }

    async getPlaylist(categories, nbrQuestion) {
        categories = categories.map(async e => {
            const categoriesPlaylists = await this.req.get(`browse/categories/${e}/playlists?limit=1`);
            
            const categoriesLists = categoriesPlaylists.data.playlists.items.map(async e => {
                if (!e) return
                const tracks = await this.req.get(`${e.tracks.href}?limit=20`);
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

            return await Promise.all(categoriesLists);
        });
        
        const tracks = [];
        let playlists = await Promise.all(categories);
        playlists.map(a => {
            a.map(b => {
                b.map(e => {
                    tracks.push(e);
                });
            });
        });

        const shuffled = tracks.sort(() => 0.5 - Math.random());
        const list = shuffled.slice(0, nbrQuestion);
        
        return list;
    }
}

const requestSpotify = new RequestSpotify();
await requestSpotify.setToken();
requestSpotify.actualiseToken();

export default requestSpotify;