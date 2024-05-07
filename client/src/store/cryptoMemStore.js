let memStore = {};

async function hashFunction(input) {
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hash = await window.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.error("Hashing failed:", error);
    throw error;
  }
}

async function kdfFunction(email, password, pin = "") {
  try {
    const passwordBuffer = new TextEncoder().encode(password);
    const salt = new TextEncoder().encode(email + pin);

    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      passwordBuffer,
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    const deriveParams = {
      name: "PBKDF2",
      salt: salt,
      iterations: 10000,
      hash: "SHA-256",
    };

    const aesKey = await crypto.subtle.deriveKey(
      deriveParams,
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );

    return aesKey;
  } catch (error) {
    console.error("Error in kdfFunction:", error);
    throw error;
  }
}

export async function processCredentials(email, password, pin = "") {
  try {
    const clientHashedUserId = await hashFunction(email);
    const clientHashedPassword = await hashFunction(password);
    const encryptionKey = await kdfFunction(email, password, pin);

    memStore = { clientHashedUserId, clientHashedPassword, encryptionKey };
  } catch (error) {
    console.error("Error processing credentials:", error);
    throw error;
  }
}

export function getItem(key) {
  return memStore[key];
}

export function removeItem(key) {
  delete memStore[key];
}
