import { agent, privateKeyStore } from './veramoAgent';

export type StoredIdentity = {
  did: string;
  privateKeyHex: string;
  publicKeyHex: string;
  kid: string;
  type: string;
};

const STORAGE_KEY = 'peerplay-identity';

// 🔹 Read from localStorage (used when user explicitly saves to browser)
export function getStoredIdentity(): StoredIdentity | null {
  const existing = localStorage.getItem(STORAGE_KEY);
  return existing ? JSON.parse(existing) : null;
}

// 🔹 Manually save to browser storage (after user confirms)
export function saveIdentityToBrowser(identity: StoredIdentity): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(identity));
}

// 🔹 Manually clear identity (optional UI reset)
export function clearStoredIdentity(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// 🔹 Create a new DID + key pair in memory
export async function createIdentityInMemory(): Promise<StoredIdentity> {
  const identity = await agent.didManagerCreate();
  const kid = identity.keys[0].kid;

  // Get public info
  const key = await agent.keyManagerGet({ kid });

  // Access private key directly from the store
  const privateEntry = await privateKeyStore.getKey({ alias: kid });

  return {
    did: identity.did,
    privateKeyHex: privateEntry.privateKeyHex,
    publicKeyHex: key.publicKeyHex!,
    kid: key.kid,
    type: key.type,
  };
}

export const isStoredIdentity = (data: any): data is StoredIdentity => {
  return (
    typeof data === 'object' &&
    typeof data.did === 'string' &&
    typeof data.privateKeyHex === 'string' &&
    typeof data.publicKeyHex === 'string' &&
    typeof data.kid === 'string' &&
    typeof data.type === 'string'
  );
};

export const handleGenerate = async (setMessage: any) => {
  const newIdentity = await createIdentityInMemory(); // does NOT store in localStorage

  const blob = new Blob([JSON.stringify(newIdentity, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'peerplay-identity.json';
  a.click();

  setMessage("✅ Identity created! Please download the file and then import it below.");
};
