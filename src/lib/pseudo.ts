export function formatPseudo(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return "";
  return trimmed.startsWith("@") ? trimmed : `@${trimmed}`;
}

export function normalizePseudoInput(input: string): string {
  return input.trim().replace(/^@+/, "");
}
