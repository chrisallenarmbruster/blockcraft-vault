let memStore = {};

export function setItem(key, value) {
  memStore[key] = value;
}

export function getItem(key) {
  return memStore[key];
}

export function removeItem(key) {
  delete memStore[key];
}

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

export async function encryptData(unencryptedData) {
  try {
    const encryptionKey = getItem("encryptionKey");
    const iv = window.crypto.getRandomValues(new Uint8Array(16));

    const unencryptedDataString = JSON.stringify(unencryptedData);
    const data = new TextEncoder().encode(unencryptedDataString);

    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const encryptedDataWithIv = new Uint8Array(
      iv.length + encryptedData.byteLength
    );
    encryptedDataWithIv.set(iv);
    encryptedDataWithIv.set(new Uint8Array(encryptedData), iv.length);

    const base64String = btoa(String.fromCharCode(...encryptedDataWithIv));

    return base64String;
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}

export async function decryptData(base64String) {
  try {
    const encryptionKey = getItem("encryptionKey");

    const encryptedData = Uint8Array.from(atob(base64String), (c) =>
      c.charCodeAt(0)
    );

    const iv = encryptedData.slice(0, 16);
    const data = encryptedData.slice(16);

    const decryptedData = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      encryptionKey,
      data
    );

    const decryptedDataString = new TextDecoder().decode(
      new Uint8Array(decryptedData)
    );
    const decryptedDataObject = JSON.parse(decryptedDataString);
    return decryptedDataObject;
  } catch (error) {
    console.error("Decryption failed:", error);
    throw error;
  }
}
