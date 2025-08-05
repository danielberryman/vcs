# UIdentity – A Fully Sovereign Identity System (No Backend Required)

> How I used Veramo, React, and QR codes to create a decentralized, educational identity system anyone can run for free.

---

## 🧩 The Problem

Self-Sovereign Identity (SSI) and Verifiable Credentials (VCs) are supposed to let people own their identity and data. But most implementations still depend on hosted infrastructure — centralized DID resolvers, cloud storage, backend servers, or proprietary wallets.

I wanted to explore a simple question:

**What would it look like to build a fully sovereign identity system that runs entirely in the browser, with no backend at all?**

This wasn’t a client request. I was the client. The goal was to create an open-source, local-first identity stack that:

- Generates DIDs and key pairs
- Signs and verifies Verifiable Credentials
- Shares them peer-to-peer via QR code
- Works offline and has zero HTTP dependencies

---

## ⚙️ The Constraints & Complexity

### 🧠 Standards Complexity
Even with tooling like [Veramo](https://veramo.io), the DID and VC specs are flexible and non-trivial. I had to deeply understand how to:
- Generate and manage key pairs in the browser
- Issue standards-compliant VCs
- Manually verify credentials without external services

### 🌐 Sovereignty Constraint
To maintain full user control:
- **No server**
- **No login**
- **No database**
- **No centralized infrastructure**

Everything needed to be client-side and optionally exportable.

### 📱 Mobile Accessibility
To test across devices, I briefly ran a local Node server to scan QR codes between my laptop and phone — no production backend involved.

---

## 🛠️ The Solution

Built with:

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/) for clean, mobile-first design
- [Veramo](https://veramo.io) for decentralized identity tooling
- [qrcode.react](https://github.com/zpao/qrcode.react) for QR-based credential exchange

### 📲 App Structure: 5 Core Tabs

| Tab       | Purpose |
|-----------|---------|
| **Identity** | Generate a DID. Download or upload a local keypair file. Color-coded UI shows what’s stored in browser vs. shared. |
| **Forms**    | Create reusable form templates. Fill them out and sign as a VC. A QR code is generated. |
| **Attest**   | Scan a VC. Review, sign, and generate a new VC + QR code to continue the trust chain. |
| **Verify**   | Scan any VC QR. Verifies and displays credentials. Optionally store verified VCs locally. |
| **How It Works** | Explains DIDs, signing, QR flows, and the color-coded trust model. Manual = clarity. |

---

## 🧠 UX Philosophy

The goal wasn’t just to make identity tech work — it was to make it understandable:

- **Color-coded interface** teaches users what’s stored, shared, or ephemeral
- **Manual flows** encourage intentionality and reflection
- **Education-first UX** helps users internalize core concepts like trust, signing, and ownership

No wallets. No background sync. No magic. Just you and your browser.

---

## 📈 Results

- ✅ **Fully working identity system** — DID generation, VC signing, QR-based exchange, and verification
- ✅ **Zero backend required**
- ✅ **Built-in education layer**
- 🔁 **Forkable foundation** for any community or niche use case
- 🧪 **Next step**: Live workshop or tutorial to test usability and onboarding

---

## 💡 Key Takeaways

- Backend-less ≠ easy. It means rethinking architecture from the ground up.
- Education is infrastructure. The more transparent the flow, the stronger the trust.
- Fully local identity tools are possible — and surprisingly empowering.

---

## 🚀 Try It Out

> **[🌐 Live Demo](https://candid-gecko-010763.netlify.app)**  
> Works on mobile — no install or wallet required.

> **[💻 GitHub Repo](https://github.com/danielberryman/vcs)**  
> Fork it, remix it, or build on top.

---
