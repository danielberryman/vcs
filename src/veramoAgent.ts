import {
  createAgent,
  type IDIDManager,
  type IKeyManager,
  type IResolver,
} from '@veramo/core';
import { DIDManager, MemoryDIDStore } from '@veramo/did-manager';
import { KeyManager, MemoryKeyStore, MemoryPrivateKeyStore } from '@veramo/key-manager';
import { KeyManagementSystem } from '@veramo/kms-local';
import { KeyDIDProvider } from '@veramo/did-provider-key';
import { CredentialPlugin } from '@veramo/credential-w3c';
import { DIDResolverPlugin } from '@veramo/did-resolver';
import { Resolver } from 'did-resolver';
import { getDidKeyResolver } from '@veramo/did-provider-key'; // This gives you the did:key resolver


const privateKeyStore = new MemoryPrivateKeyStore();
const kms = new KeyManagementSystem(privateKeyStore);

export const agent = createAgent<IDIDManager & IKeyManager & IResolver>({
  plugins: [
    new KeyManager({
      store: new MemoryKeyStore(),
      kms: {
        local: kms,
      },
    }),
    new DIDManager({
      store: new MemoryDIDStore(),
      defaultProvider: 'did:key',
      providers: {
        'did:key': new KeyDIDProvider({
          defaultKms: 'local',
        }),
      },
    }),
    new CredentialPlugin(),
    new DIDResolverPlugin({
      resolver: new Resolver({
        ...getDidKeyResolver(),
      }),
    }),
  ],
});

// Export for direct access
export { privateKeyStore };
