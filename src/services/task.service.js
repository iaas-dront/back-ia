export function detectTasks({ username, text }, store) {
  const keywords = [
    "me encargo",
    "yo hago",
    "queda pendiente",
    "se asigna",
    "yo me encargo"
  ];

  if (keywords.some(k => text.toLowerCase().includes(k))) {
    store.tasks.push({ username, task: text });
  }
}
