import { MyServer } from "./src/models/server.js";
import 'dotenv/config';



const server = new MyServer();


server.listen();