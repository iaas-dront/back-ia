import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

socket.on("connect", () => {
  console.log("Conectado al servidor IA");

  socket.emit("ai:join", {
    username: "Kevin",
    email: "kevin@test.com",
  });

  socket.emit("ai:chat", {
    username: "Kevin",
    message: "Hola equipo, hoy vamos a definir tareas",
  });

  socket.emit("ai:voice-text", {
    username: "Kevin",
    text: "Yo me encargo del backend y del despliegue en Render",
  });

  // 👇 ESTE ES EL EVENTO QUE FALTABA
  setTimeout(() => {
    socket.emit("ai:end-meeting");
  }, 1000);
});

socket.on("ai:summary", (summary) => {
  console.log("\n===== RESUMEN IA =====\n");
  console.log(summary);
  process.exit(0);
});
