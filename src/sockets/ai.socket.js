import { meetingStore } from "../store/meeting.store.js";
import { generateSummary } from "../services/ai.service.js";
import { sendSummaryEmail } from "../services/mail.service.js";
import { detectTasks } from "../services/task.service.js";

export function registerAiSocket(io) {
  io.on("connection", (socket) => {
    console.log("🤖 AI client connected:", socket.id);

    // Usuario se une a la reunión
    socket.on("ai:join", ({ username, email }) => {
      meetingStore.participants.set(socket.id, { username, email });
      console.log(`👤 ${username} joined the meeting`);
    });

    // Mensajes de chat
    socket.on("ai:chat", ({ username, message }) => {
      meetingStore.messages.push({ username, message });
    });

    // Texto transcrito desde voz
    socket.on("ai:voice-text", ({ username, text }) => {
      meetingStore.transcripts.push({ username, text });
      detectTasks({ username, text }, meetingStore);
    });

    // Finalizar reunión → generar resumen
    socket.on("ai:end-meeting", async () => {
      try {
        const summary = await generateSummary(meetingStore);

        // 📧 Envío de resumen (mock)
        for (const user of meetingStore.participants.values()) {
          await sendSummaryEmail(user.email, summary);
        }

        // Enviar resumen al frontend
        socket.emit("ai:summary", summary);

        // 🔥 Limpiar estado para la siguiente reunión
        meetingStore.messages = [];
        meetingStore.transcripts = [];
        meetingStore.tasks = [];

        console.log("✅ Meeting summary generated and sent");
      } catch (error) {
        console.error("❌ Error generating summary:", error);
      }
    });

    // Usuario se desconecta
    socket.on("disconnect", () => {
      meetingStore.participants.delete(socket.id);
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
