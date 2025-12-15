import { meetingStore } from "../store/meeting.store.js";
import { generateSummary } from "../services/ai.service.js";
import { sendSummaryEmail } from "../services/mail.service.js";
import { detectTasks } from "../services/task.service.js";

export function registerAiSocket(io) {
  io.on("connection", (socket) => {
    console.log("🤖 AI client connected:", socket.id);

    // Usuario se une
    socket.on("ai:join", ({ username, email }) => {
      meetingStore.participants.set(socket.id, { username, email });
      console.log(`👤 ${username} joined the meeting`);
    });

    // Chat
    socket.on("ai:chat", ({ username, message }) => {
      meetingStore.messages.push({ username, message });
    });

    // Voz → texto
    socket.on("ai:voice-text", ({ username, text }) => {
      meetingStore.transcripts.push({ username, text });
      detectTasks({ username, text }, meetingStore);
    });

    // Finalizar reunión
    socket.on("ai:end-meeting", async () => {
      try {
        if (meetingStore.ended) return;
        meetingStore.ended = true;

        const summary = await generateSummary(meetingStore);

        // 📧 Enviar email
        for (const user of meetingStore.participants.values()) {
          if (user.email) {
            await sendSummaryEmail(user.email, summary);
          }
        }

        // 📤 Enviar resumen a TODOS
        io.emit("ai:summary", summary);

        // 🧹 Reset total
        meetingStore.messages = [];
        meetingStore.transcripts = [];
        meetingStore.tasks = [];
        meetingStore.participants.clear();
        meetingStore.ended = false;

        console.log("✅ Meeting summary generated and sent");
      } catch (error) {
        console.error("❌ Error generating summary:", error);
        meetingStore.ended = false;
      }
    });

    // Desconexión
    socket.on("disconnect", () => {
      meetingStore.participants.delete(socket.id);
      console.log("❌ Client disconnected:", socket.id);
    });
  });
}
