import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(store) {
  const participants = [...store.participants.values()]
    .map(p => `- ${p.username}`)
    .join("\n") || "No se registraron participantes.";

  const chat = store.messages
    .map(m => `${m.username}: ${m.message}`)
    .join("\n") || "No hubo mensajes en el chat.";

  const voice = store.transcripts
    .map(t => `${t.username}: ${t.text}`)
    .join("\n") || "No hubo intervenciones por voz.";

  const tasks = store.tasks
    .map(t => `${t.username}: ${t.task}`)
    .join("\n") || "No se detectaron tareas.";

  const prompt = `
Eres un asistente que redacta actas de reuniones de forma clara, sencilla y natural.

Información de la reunión:

Participantes:
${participants}

Mensajes del chat:
${chat}

Transcripción de voz:
${voice}

Tareas detectadas:
${tasks}

INSTRUCCIONES:
- Usa un lenguaje simple y directo.
- No inventes información.
- No agregues tareas que no estén explícitamente mencionadas.
- No uses frases genéricas como “se discutieron diversos temas”.

RESPONDE ÚNICAMENTE CON ESTE FORMATO:

### 🧾 Resumen de la reunión
Explica brevemente de qué se habló y qué decisiones se mencionaron.

### 💬 Participaciones
Indica quién habló y qué dijo de forma resumida.

### ✅ Tareas y compromisos
- Si hay tareas, enuméralas con su responsable.
- Si NO hay tareas, escribe exactamente:
"No se detectaron tareas claras durante la reunión."
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
