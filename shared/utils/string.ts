export const capitalizeWords = (s: string) => s.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());

export const slugToLabel = (s: string) => capitalizeWords(s
  .replace(/(.+)_id|Id$/, '$1')
  .replace(/[^a-zA-Z0-9]+/g, ' ')
  .replace(/([a-z])([A-Z])/g, '$1 $2')
);

