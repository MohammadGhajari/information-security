export async function createUniqueId(username1, username2) {
  const sortedUsernames = [username1, username2].sort();
  const combined = `${sortedUsernames[0]}-${sortedUsernames[1]}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(combined);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}
