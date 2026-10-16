/** Libellé affiché uniquement — ne pas utiliser pour URL, musicId ou API. */
export function getMusicFileLabel(storedPath) {
  if (!storedPath) return "";
  const path = typeof storedPath === "string" ? storedPath : storedPath.name ?? "";
  const segment = path.split("/").filter(Boolean).pop() ?? path;
  return segment;
}
