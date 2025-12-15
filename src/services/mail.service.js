export async function sendSummaryEmail(to, summary) {
  console.log("📧 (mock) Enviando resumen");
  console.log("Para:", to);
  console.log("Asunto: Resumen de la reunión");
  console.log("=================================");
  console.log(`
Hola,

Aquí tienes el resumen de la reunión:

${summary}

---
Este correo fue generado automáticamente al finalizar la sesión.
`);
}
