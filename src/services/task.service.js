export function detectTasks({ username, text }, store) {
  const normalized = text.toLowerCase().trim();

  const keywords = [
    "me encargo",
    "yo me encargo",
    "yo hago",
    "se asigna",
    "hay que",
    "tenemos que",
    "queda pendiente"
  ];

  // 1️⃣ Si no hay palabra clave → salir
  if (!keywords.some(k => normalized.includes(k))) return;

  // 2️⃣ Evitar frases demasiado cortas
  if (normalized.split(" ").length < 4) return;

  // 3️⃣ Frases vagas (pero SIN "queda pendiente")
  const vaguePhrases = [
    "hay que ver",
    "hay que revisar",
    "tenemos que ver",
    "hay que hacerlo",
    "tenemos que hacerlo"
  ];

  if (vaguePhrases.some(v => normalized.startsWith(v))) return;

  // 4️⃣ Evitar duplicados (comparando normalizado)
  const exists = store.tasks.some(
    t => t.task.toLowerCase().trim() === normalized
  );
  if (exists) return;

  // 5️⃣ Guardar tarea
  store.tasks.push({
    username,
    task: text.trim(),
    createdAt: Date.now()
  });
}

