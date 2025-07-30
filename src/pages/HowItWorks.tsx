import Components from '../components/index';

export default function HowItWorks() {
    return (
        <div className="">
            <Components.Header title="How It Works" />
            <Components.Separator />
            <div className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">Table of Contents</h2>
                <ul>
                    <li><a href="#tdlr" className="underline">The Short Version</a></li>
                    <li><a href="#examples" className="underline">Example Use Cases</a></li>
                    <li><a href="#flow" className="underline">Overall Flow</a></li>
                    <li><a href="#id" className="underline">Identity</a></li>
                    <li><a href="#forms" className="underline">Forms</a></li>
                    <li><a href="#attest" className="underline">Attestation</a></li>
                    <li><a href="#verify" className="underline">Verification</a></li>
                </ul>
            </div>
            <Components.Separator />
            <div id="tdlr" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">THE SHORT VERSION</h2>
                <h3 className="font-bold">DIDs</h3>
                <p>Your self-owned digital identity—secured by math, not companies or governments.</p>
                <h3 className="font-bold">VCs</h3>
                <p>Signed statements about you—like a badge or certificate. Issued by anyone: individuals, communities, companies, governments.</p>
                <h3 className="font-bold">Attestations</h3>
                <p>You issue a VC about someone else. “I know them. I trust them.”</p>
                <h3 className="font-bold">Verification</h3>
                <p>Anyone can check the math. No need to ask a central authority.</p>
                <h3 className="font-bold">Web of Trust</h3>
                <p>Trust grows peer-to-peer. It’s powered by relationships and verified by cryptography.</p>
            </div>
            <Components.Separator />
            <div id="examples" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">EXAMPLE USE CASES</h2>
                <h3 className="font-bold">🎭 Cast Member Credential</h3>
                <p>A director issues a VC to an actor confirming they performed in a production. This credential can be used to prove experience to future collaborators.</p>
                <h3 className="font-bold">👥 Peer Endorsement</h3>
                <p>Two artists work together and issue mutual VCs saying, “I’ve worked with this person and recommend them.” These mutual attestations strengthen community trust.</p>
                <h3 className="font-bold">🎓 Workshop Completion</h3>
                <p>A community organizer issues VCs to attendees who complete a training or workshop. These VCs can be reused as prerequisites for future programs.</p>
                <h3 className="font-bold">📸 Verified Portfolio Contributor</h3>
                <p>A designer issues VCs to collaborators credited in a portfolio project, verifying who did what—great for transparent team attribution.</p>
                <h3 className="font-bold">🎤 Event Participation</h3>
                <p>After a community meetup, the host issues a VC to each attendee’s DID, creating a decentralized attendance record that can power reputation systems.</p>
            </div>
            <Components.Separator />
            <div id="flow" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">OVERALL FLOW</h2>
                <h3 className="font-bold">1. Create a Decentralized Identifier (DID)</h3>
                <p>You start by generating a DID, a secure and unique digital identity that only you control. This DID acts as your anchor in the decentralized world.</p>
                <h3 className="font-bold">2. Receive or Issue a Verifiable Credential (VC)</h3>
                <p>With your DID, you can receive credentials from others (like a school or peer), or issue them yourself. A VC is a signed statement tied to a DID—such as proof of membership or a completed achievement.</p>
                <h3 className="font-bold">3. Attest to Someone Else</h3>
                <p>Attestation means using your DID to issue a VC about someone else. You might say, “I trust this person” or “They attended my event,” and sign it to make it verifiable.</p>
                <h3 className="font-bold">4. Verify a Credential</h3>
                <p>Anyone can verify a VC by checking the digital signature against the issuer’s DID. This ensures the credential hasn’t been tampered with and really came from who it claims to.</p>
            </div>
            <Components.Separator />
            <div id="id" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">IDENTITY</h2>
                <h3 className="font-bold">Decentralized Identifiers</h3>
                <p>Decentralized Identifiers (DIDs) are a new kind of digital ID that puts you in control. Unlike traditional usernames or email-based logins, a DID is generated and owned by you—without relying on a central authority like Google or Facebook. Each DID is unique, cryptographically secure, and can be used to prove your identity across different apps or services in a privacy-preserving way.</p>
                <h3 className="font-bold">Creating a Decentralized Identifier</h3>
                <p>When you create a DID, your browser generates a cryptographic key pair—essentially a secure digital signature—used to prove ownership. This process happens entirely on your device, ensuring that no one else has access to your keys. After generation, you can download your DID to use later or store it in your browser for convenience. It's like creating a secure passport that only you control.</p>
                <h3 className="font-bold">Importing a Decentralized Identifier</h3>
                <p>If you've previously created and downloaded a DID, you can import it back into your browser to continue using it. This lets you carry your identity across devices or sessions without relying on a centralized login system. During the import, the system reads your saved DID file and restores your ability to use it for verification, issuing credentials, or interacting with other decentralized apps.</p>
            </div>
            <Components.Separator />
            <div id="forms" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">FORMS</h2>
                <h3 className="font-bold">What's a Verified Credential (VC)?</h3>
                <p className="pb-2">A Verifiable Credential (VC) is a secure digital statement—like a claim form or certificate—that can be shared and independently verified. It's cryptographically signed by the issuer, proving that the information hasn't been tampered with.</p>
                <h3 className="font-bold">How is a VC different than a DID?</h3>
                <p>A Decentralized Identifier (DID) is like a digital name tag—it identifies a person, organization, or device in a secure, self-owned way. It doesn’t contain much information beyond a unique identifier and the cryptographic keys that prove ownership.</p>
                <p>A Verifiable Credential (VC), on the other hand, is like a digital certificate or badge. It contains claims (e.g., “Daniel is a certified teacher”) that are signed by an issuer and can be independently verified. A VC references a DID to specify who the credential is about and who issued it.</p>
                <p>In short: a DID is an identity, and a VC is a statement about that identity—like an award, license, or membership card.</p>
                <h3 className="font-bold">Creating a VC Form Template</h3>
                <p className="pb-4">Creating your <strong>own VC form</strong> lets you define the <strong>title, description, and custom fields</strong> so you can issue credentials tailored to your specific use case—whether it's a membership badge, a course completion certificate, or a peer endorsement. This gives you full control over what information is captured, how it's displayed, and what it means to your community.</p>
            </div>
            <Components.Separator />
            <div id="attest" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">ATTESTATION</h2>
                <h3 className="font-bold">What Is an Attestation?</h3>
                <p>An attestation is a signed statement you make about someone else. It's a way to say, “I know this person,” or “I trust this claim.”</p>
                <h3 className="font-bold">Who Can Attest?</h3>
                <p>Anyone with a DID can issue attestations—whether you're an individual, an organization, or part of a group. There's no gatekeeper.</p>
                <h3 className="font-bold">Why It Matters</h3>
                <p>Each attestation strengthens the web of trust. The more people vouch for each other, the more resilient and reputation-rich your community becomes.</p>
                <h3 className="font-bold">What You Can Say</h3>
                <p>You choose the title, description, and fields. Attest to skills, experiences, membership, trust—anything that matters to your network.</p>
            </div>
            <Components.Separator />
            <div id="verify" className="flex flex-col gap-3">
                <h2 className="text-lg font-bold">VERIFICATION</h2>
                <h3 className="font-bold">What Is Verification?</h3>
                <p>Verification is the process of checking that a credential is real and hasn't been tampered with. It confirms who issued it and that it belongs to who it claims.</p>
                <h3 className="font-bold">How It Works</h3>
                <p>Instead of calling a company or database, verification uses cryptographic math. The signature on the credential is checked against the issuer's DID.</p>
                <h3 className="font-bold">Why It Matters</h3>
                <p>Anyone can verify a credential—instantly, without needing permission. This makes trust portable, transparent, and independent of central systems.</p>
            </div>
        </div>
    );
}
