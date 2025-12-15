import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateSummary(store) {
  const participants = [...store.participants.values()]
    .map(p => `- ${p.username}`)
    .join("\n");

  const chat = store.messages
    .map(m => `${m.username}: ${m.message}`)
    .join("\n");

  const voice = store.transcripts
    .map(t => `${t.username}: ${t.text}`)
    .join("\n");

  const tasks = store.tasks
    .map(t => `${t.username}: ${t.task}`)
    .join("\n");

  const prompt = `
Participantes:
${participants}

Chat:
${chat}

Voz:
${voice}

Tareas detectadas:
${tasks}

Genera:
1. Resumen general de la reunión
2. Lista clara de tareas con responsables
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}
