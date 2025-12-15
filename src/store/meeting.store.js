export const meetingStore = {
  participants: new Map(),
  messages: [],
  transcripts: [],
  tasks: [],
  ended: false, // ⬅️ evita múltiples cierres
};
