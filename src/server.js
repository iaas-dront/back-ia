import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

import { registerAiSocket } from "./sockets/ai.socket.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("AI Summary Server running 🚀");
});

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

registerAiSocket(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`AI server listening on ${PORT}`);
});
console.log("OPENAI KEY:", process.env.OPENAI_API_KEY?.slice(0, 10));
