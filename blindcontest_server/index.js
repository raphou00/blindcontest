import bodyParser from "body-parser";
import cors from "cors";
import { app, server } from "./components/socket.js";


app.use(bodyParser.json());
app.use(cors());


server.listen(3000, () => console.log("http://127.0.0.1:3000"));