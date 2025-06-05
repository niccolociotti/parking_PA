export function parseDateString(str: string): Date | null {
  // Provo formato “DD-MM-YYYY HH:mm”
  const reg = str.match(/^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/);
  if (reg) {
    const day = +reg[1], month = +reg[2] - 1, year = +reg[3];
    const hour = +reg[4], minute = +reg[5];
    const d = new Date(year, month, day, hour, minute, 0);
    // Verifica validità (es. non esiste 32-13-2025...)
    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day &&
      d.getHours() === hour &&
      d.getMinutes() === minute
    ) {
      return d;
    }
    return null;
  }

  // Se non matcha “DD-MM-YYYY HH:mm”, provo “DD-MM-YYYY” puro
  const reg2 = str.match(/^(\d{2})-(\d{2})-(\d{4})$/);
  if (reg2) {
    const day = +reg2[1], month = +reg2[2] - 1, year = +reg2[3];
    // pongo orario a mezzogiorno (12:00) per evitare shift di fuso
    const d = new Date(year, month, day, 12, 0, 0);
    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    ) {
      return d;
    }
    return null;
  }

  // Altrimenti provo a parsare come ISO (es. "2025-07-01T08:00:00Z" o "2025-07-01T08:00")
  const d0 = new Date(str);
  if (isNaN(d0.getTime())) return null;
  // Se è valido, mantengo anno/mese/giorno/ora/minuto e metto orario esatto (non mezzogiorno)
  return new Date(
    d0.getFullYear(),
    d0.getMonth(),
    d0.getDate(),
    d0.getHours(),
    d0.getMinutes(),
    d0.getSeconds()
  );
}