export function sanitizeFilename(name) {
  return name
    .replace(/[^a-z0-9_\-\.]/gi, '_')
    .replace(/_+/g, '_')
    .slice(0, 100);
}
