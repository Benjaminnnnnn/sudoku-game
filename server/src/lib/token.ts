import { PuzzlePayload } from '../../../shared/types';

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const INITIALIZATION_VECTOR_LENGTH = 12;

async function createEncryptionKey(secret: string) {
  const secretBytes = encoder.encode(secret);
  const hash = await crypto.subtle.digest('SHA-256', secretBytes);

  return crypto.subtle.importKey('raw', hash, 'AES-GCM', false, ['encrypt', 'decrypt']);
}

function toBase64Url(bytes: Uint8Array): string {
  return Buffer.from(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
}

function fromBase64Url(value: string): Uint8Array {
  const paddedValue = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return new Uint8Array(Buffer.from(paddedValue, 'base64'));
}

export async function encodeGameToken(payload: PuzzlePayload, secret: string): Promise<string> {
  const key = await createEncryptionKey(secret);
  const initializationVector = crypto.getRandomValues(new Uint8Array(INITIALIZATION_VECTOR_LENGTH));
  const payloadBytes = encoder.encode(JSON.stringify(payload));
  const encryptedBytes = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: initializationVector,
    },
    key,
    payloadBytes,
  );

  const combinedBytes = new Uint8Array(initializationVector.length + encryptedBytes.byteLength);
  combinedBytes.set(initializationVector, 0);
  combinedBytes.set(new Uint8Array(encryptedBytes), initializationVector.length);

  return toBase64Url(combinedBytes);
}

export async function decodeGameToken(token: string, secret: string): Promise<PuzzlePayload> {
  const tokenBytes = fromBase64Url(token);

  if (tokenBytes.length <= INITIALIZATION_VECTOR_LENGTH) {
    throw new Error('Invalid game token.');
  }

  const initializationVector = tokenBytes.slice(0, INITIALIZATION_VECTOR_LENGTH);
  const encryptedBytes = tokenBytes.slice(INITIALIZATION_VECTOR_LENGTH);
  const key = await createEncryptionKey(secret);

  try {
    const decryptedBytes = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: initializationVector,
      },
      key,
      encryptedBytes,
    );

    return JSON.parse(decoder.decode(decryptedBytes)) as PuzzlePayload;
  } catch {
    throw new Error('Invalid game token.');
  }
}
