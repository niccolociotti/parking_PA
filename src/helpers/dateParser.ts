export function parseDateString(str: string): Date | null {
  // regex per "DD-MM-YYYY" (ad esempio "31-12-2025")
  const ddmmyyyy = /^(\d{2})-(\d{2})-(\d{4})$/;
  const m = str.match(ddmmyyyy);
  if (m) {
    const day = parseInt(m[1], 10);
    const month = parseInt(m[2], 10) - 1; // JavaScript: 0 = gennaio, 11 = dicembre
    const year = parseInt(m[3], 10);
    const d = new Date(year, month, day );
    // Verifica che la data sia valida (ad es. "31-02-2025" non esiste)
    if (
      d.getFullYear() === year &&
      d.getMonth() === month &&
      d.getDate() === day
    ) {
      return d;
    }
    return null;
  }

  // Se non era "DD-MM-YYYY", tentiamo con il parser nativo (ISO, RFC, ecc.)
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}