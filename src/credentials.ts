import { agent } from './veramoAgent';
import { type StoredIdentity } from './identity';

export async function issueVC(
  issuer: StoredIdentity,
  subjectDID: string
) {
  const credential = {
    issuer: { id: issuer.did },
    type: ['VerifiableCredential', 'TrustedActor'],
    issuanceDate: new Date().toISOString(),
    credentialSubject: {
      id: subjectDID,
      reputation: 'trusted',
    },
  };

  const verifiableCredential = await agent.createVerifiableCredential({
    credential,
    proofFormat: 'jwt', // or 'lds' if using JSON-LD
  });

  return verifiableCredential;
}
