export async function sha256(text: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(text)

  const hash = await crypto.subtle.digest("SHA-256", data)

  return [...new Uint8Array(hash)]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("")
}
