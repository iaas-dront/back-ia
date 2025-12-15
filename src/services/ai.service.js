import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(store) {
  // ─────────────────────────────
  // PARTICIPANTES
  // ─────────────────────────────
  const participants =
    [...store.participants.values()]
      .map(p => `- ${p.username}`)
      .join("\n") || "No se registraron participantes.";

  // ─────────────────────────────
  // CHAT
  // ─────────────────────────────
  const chat =
    store.messages.length > 0
      ? store.messages.map(m => `${m.username}: ${m.message}`).join("\n")
      : "No hubo mensajes en el chat.";

  // ─────────────────────────────
  // VOZ
  // ─────────────────────────────
  const voice =
    store.transcripts.length > 0
      ? store.transcripts.map(t => `${t.username}: ${t.text}`).join("\n")
      : "No hubo intervenciones por voz.";

  // ─────────────────────────────
  // TAREAS (CLAVE ANTI-INVENCIÓN)
  // ─────────────────────────────
  const tasks =
    store.tasks.length > 0
      ? store.tasks.map(t => `${t.username}: ${t.task}`).join("\n")
      : "NO_HAY_TAREAS";

  // ─────────────────────────────
  // PROMPT FINAL
  // ─────────────────────────────
  const prompt = `
Eres un asistente que redacta actas reales de reuniones.
Tu objetivo es ser claro, directo y NO inventar información.

Información de la reunión:

Participantes:
${participants}

Mensajes del chat:
${chat}

Transcripción de voz:
${voice}

Tareas detectadas:
${tasks}

REGLAS OBLIGATORIAS:
- Usa lenguaje simple y natural.
- NO inventes tareas, responsables ni fechas.
- NO agregues tareas genéricas.
- NO uses textos como "[Nombre del responsable]" o "[Especificar fecha]".
- Si "Tareas detectadas" es exactamente "NO_HAY_TAREAS",
  escribe exactamente:
  "No se detectaron tareas claras durante la reunión."

RESPONDE ÚNICAMENTE CON ESTE FORMATO:

### 🧾 Resumen de la reunión
Describe brevemente de qué se habló.

### 💬 Participaciones
Menciona quién habló y qué dijo de forma resumida.

### ✅ Tareas y compromisos
(Lista real o mensaje de no tareas)
`;

  // ─────────────────────────────
  // LLAMADA A OPENAI
  // ─────────────────────────────
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2, // 🔒 menos creatividad = menos inventos
  });

  return response.choices[0].message.content;
}
