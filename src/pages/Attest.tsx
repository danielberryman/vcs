import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { agent } from '../veramoAgent';
import { useScanQRCode } from '../hooks/useScanQRCode'; // You'd implement this separately
import Components from '../components/index';
import { useResourceManager } from '../hooks/useResourceManager';
import { useGlobalModal } from '../hooks/useGlobalModal';
import { type VerifiableCredential } from '@veramo/core';
import RecursiveObjectList from '../components/RecursiveObjectList';
import { FaCamera } from 'react-icons/fa';

const BASE_URL = `${window.location.origin}${import.meta.env.BASE_URL}/`;
const FORM_STORAGE_KEY = 'peerplay-forms';

const tabs = [
    { key: 'request', label: 'Requested Claims' },
    { key: 'issue', label: 'Issued Claims' },
];

export default function Attest() {
    const [tab, setTab] = useState<'request' | 'issue'>('request');
    const [initialClaim, setInitialClaim] = useState<any>(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        const encoded = query.get('claim');
        if (encoded) {
            try {
                const parsed = JSON.parse(decodeURIComponent(encoded));
                setInitialClaim(parsed);
                setTab('issue'); // or whatever your tab-switching logic is
            } catch (e) {
                console.error('Invalid claim in URL:', e);
            }
        }
    }, []);

    return (
        <div className="">
            <Components.Header title="Attestation" />
            <Components.Separator />
            <Components.CustomTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

            {tab === 'request' && <RequestTab />}
            {tab === 'issue' && <IssueTab preloadedClaim={initialClaim} />}
        </div>
    );
}

type VCClaimDefinition = {
    formId: string;
    credentialSubject: {
        id: string;
        [key: string]: string;
    };
};

export const isVCClaimDefinition = (data: any): data is VCClaimDefinition => {
    return (
        typeof data === 'object' &&
        typeof data.formId === 'string' &&
        typeof data.credentialSubject === 'object' &&
        typeof data.credentialSubject.id === 'string'
    );
};

function RequestTab() {
    const {
        imported,
        stored,
        handleImport,
        handleImportFromGenerate,
        saveImported,
        clearImported,
        clearStorage,
        removeStored,
    } = useResourceManager<VCClaimDefinition>({
        localStorageKey: 'peerplay-claims',
        validate: isVCClaimDefinition,
        mode: 'list',
    });
    const listStored = Array.isArray(stored) && stored.length > 0 ? stored : [];

    const [storedForms, setStoredForms] = useState<any[]>([]);
    const [selectedForm, setSelectedForm] = useState<any>(null);
    const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

    const { showModal, hideModal } = useGlobalModal();

    useEffect(() => {
        const getStoredForms = () => {
            const data = localStorage.getItem(FORM_STORAGE_KEY);
            data && setStoredForms(JSON.parse(data));
        }
        getStoredForms();
    }, []);

    const handleCreateClaim = () => {
        const stored = localStorage.getItem('peerplay-identity');
        if (!stored) return alert('You need an identity first.');
        const identity = JSON.parse(stored);

        const filledClaim = {
            formId: selectedForm.id,
            credentialSubject: {
                id: identity.did,
                ...fieldValues,
            },
        };
        handleImportFromGenerate(filledClaim);
        handleDownload(filledClaim);
        setFieldValues({});
        setSelectedForm(null);
    };

    const handleDownload = (form: VCClaimDefinition) => {
        const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${form.formId}_claim.json`;
        a.click();
    };

    const generateQRCode = (claim: VCClaimDefinition) => {
        const encoded = encodeURIComponent(JSON.stringify(claim));
        console.log(`${BASE_URL}attest?claim=${encoded}`);
        
        showModal(
            <div className='flex flex-col gap-3 items-center'>
                <h3 className="font-semibold">Scan this with a peer to issue:</h3>
                <QRCodeSVG value={`${BASE_URL}attest?claim=${encoded}`} size={256} />
                <Components.CustomButton
                    text="Close"
                    onClick={hideModal}
                    bgColor="bg-blue-600"
                    textColor="text-white"
                    bghColor="bg-blue-700"
                />
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-2 justify-between items-center">
                <h2 className="text-lg font-semibold">Loaded Requested Claim</h2>
                <div className="flex gap-2">
                    {!imported ? (
                        <Components.LabelInputButton
                            text="Load (.json)"
                            onChange={handleImport}
                            bgColor="bg-yellow-300"
                            bghColor="bg-yellow-400"
                            inline-block
                        />
                    ) : (
                        <Components.CustomButton
                            text="Save to Browser"
                            onClick={saveImported}
                            bgColor="bg-blue-600"
                            textColor="text-white"
                            bghColor="bg-blue-700"
                        />
                    )}
                </div>
            </div>
            {imported ? (
                <div className="space-y-4">
                    <div className="p-3 pt-2 bg-yellow-300 rounded">
                        <div className="flex justify-between items-start">
                            <div className="w-3/4 break-words">
                                <h2 className="text-lg font-semibold">{imported.formId}</h2>
                                <ul className="text-sm pt-2 pb-4">
                                    {Object.keys(imported.credentialSubject).map((key: string, i) => {
                                        if (key === "id") return;

                                        return (
                                            <li key={i}>• <strong>{imported.credentialSubject[key]}</strong></li>
                                        )
                                    })}
                                </ul>
                            </div>
                            <Components.CustomButton
                                text="X"
                                onClick={clearImported}
                                sm={true}
                                minWidth=""
                            />
                        </div>
                        <Components.CustomButton
                            text="QR Code"
                            onClick={() => generateQRCode(imported)}
                            sm={true}
                        />
                    </div>
                </div>
            ) : (
                <p className="text-gray-600">No loaded claim.</p>
            )}
            <div className="flex gap-2 justify-between items-center">
                <h2 className="text-lg font-semibold">Saved Requested Claims</h2>
                <div className="flex gap-2">
                    {listStored.length > 0 && (
                        <Components.CustomButton
                            text="Clear All"
                            onClick={clearStorage}
                        />
                    )}
                </div>
            </div>
            {listStored.length > 0 ? (
                <div className="space-y-4">
                    {listStored.map((form, idx) => (
                        <div key={idx} className="p-3 bg-blue-600 rounded shadow-sm">
                            <div className="flex justify-between items-start">
                                <div className="w-3/4 break-words">
                                    <h2 className="text-lg text-white font-semibold">{form.formId}</h2>
                                    <ul className="text-sm text-white pt-2 pb-4">
                                        {Object.keys(form.credentialSubject).map((key: string, i) => {
                                            return (
                                                <li key={i}>• <strong>{form.credentialSubject[key]}</strong></li>
                                            )
                                        })}
                                    </ul>
                                </div>
                                <Components.CustomButton
                                    text="X"
                                    onClick={() => removeStored(idx)}
                                    sm={true}
                                    minWidth=""
                                />
                            </div>
                            <div className="flex gap-2">
                                <Components.CustomButton
                                    text="QR Code"
                                    onClick={() => generateQRCode(form)}
                                    sm={true}
                                />
                                <Components.CustomButton
                                    text="Download File (.json)"
                                    onClick={() => handleDownload(form)}
                                    sm={true}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No saved forms.</p>
            )}
            <h2 className="text-lg font-bold mb-2">Select a Form</h2>
            <select
                className="w-full border rounded px-3 py-2 mb-4"
                onChange={(e) => {
                    const form = storedForms.find((f: any) => f.id === e.target.value);
                    setSelectedForm(form);
                    setFieldValues({});
                }}
            >
                <option value="">-- Choose a form --</option>
                {storedForms.map((form: any, idx: number) => (
                    <option key={idx} value={form.id}>{form.title}</option>
                ))}
            </select>

            {
                selectedForm && (
                    <div className="space-y-3">
                        {selectedForm.fields.map((field: any, i: number) => (
                            <input
                                key={i}
                                className="w-full border rounded px-3 py-2"
                                placeholder={field.name}
                                value={fieldValues[field.name] || ''}
                                onChange={(e) =>
                                    setFieldValues({ ...fieldValues, [field.name]: e.target.value })
                                }
                            />
                        ))}
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            onClick={handleCreateClaim}
                        >
                            Generate Claim
                        </button>
                    </div>
                )
            }
        </div>
    );
}

export const isVerifiableCredential = (data: any): data is VerifiableCredential => {
    return (
        typeof data === 'object' &&
        typeof data.credentialSubject === 'object' &&
        typeof data.issuer === 'object' &&
        typeof data.proof === 'object' &&
        typeof data.type === 'object'
    );
};

function IssueTab({ preloadedClaim }: { preloadedClaim?: any }) {
    const {
        imported,
        stored,
        handleImport,
        handleImportFromGenerate,
        saveImported,
        clearImported,
        clearStorage,
        removeStored,
    } = useResourceManager<VerifiableCredential>({
        localStorageKey: 'peerplay-claims',
        validate: isVerifiableCredential,
        mode: 'list',
    });
    const listStored = Array.isArray(stored) && stored.length > 0 ? stored : [];

    const [scannedClaim, setScannedClaim] = useState<any>(null);
    const [signedVC, setSignedVC] = useState<any>(null);
    const [encodedVC, setEncodedVC] = useState<any>(null);
    // const { QRScanner } = useScanQRCode(setScannedClaim); // Custom hook/comp that gives you scanner

    const { showModal, hideModal } = useGlobalModal();

    // Load preloaded claim on mount
    useEffect(() => {
        if (preloadedClaim) {
            setScannedClaim(preloadedClaim);
        }
    }, [preloadedClaim]);

    const handleSign = async () => {
        const identityJSON = localStorage.getItem('peerplay-identity');
        if (!identityJSON) return alert('No local identity found');
        const issuer = JSON.parse(identityJSON);
        await agent.didManagerImport({
            did: issuer.did,
            provider: 'did:key',
            controllerKeyId: issuer.kid,
            keys: [
                {
                    kid: issuer.kid,
                    type: issuer.type,
                    publicKeyHex: issuer.publicKeyHex,
                    privateKeyHex: issuer.privateKeyHex,
                    kms: 'local'
                },
            ],
        });

        const vc = await agent.createVerifiableCredential({
            credential: {
                issuer: { id: issuer.did },
                type: ['VerifiableCredential', 'AttestedClaim'],
                issuanceDate: new Date().toISOString(),
                credentialSubject: scannedClaim.credentialSubject,
            },
            proofFormat: 'jwt',
        });

        handleImportFromGenerate(vc);
        setScannedClaim(null);
        const encoded = encodeURIComponent(btoa(JSON.stringify(vc)));
        setEncodedVC(`${window.location.origin}/download-vc?vc=${encoded}`);
    };

    const generateQRCode = (claim: VerifiableCredential) => {
        const encoded = encodeURIComponent(JSON.stringify(claim));
        console.log(`${BASE_URL}verify?vc=${encoded}`);

        showModal(
            <div className='flex flex-col gap-3 items-center'>
                <h3 className="font-semibold">Scan this with a peer to issue:</h3>
                <QRCodeSVG value={`${BASE_URL}verify?vc=${encoded}`} size={256} />
                <Components.CustomButton
                    text="Close"
                    onClick={hideModal}
                    bgColor="bg-blue-600"
                    textColor="text-white"
                    bghColor="bg-blue-700"
                />
            </div>
        )
    }

    const handleDownload = (form: VerifiableCredential) => {
        const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `verifiable_cred.json`;
        a.click();
    };

    return (
        <div>
            {!scannedClaim ? (
                <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold">
                        <i>Scan a claim QR with your camera to sign.</i>
                    </h2>
                    <FaCamera />
                    {/* <QRScanner /> */}
                </div>
            ) : (
                <>
                    <div>
                        <h3 className="font-semibold">Claim to Sign:</h3>
                        <pre className="bg-gray-100 p-2 rounded text-xs mb-2">
                            {JSON.stringify(scannedClaim, null, 2)}
                        </pre>
                    </div>
                    <Components.CustomButton
                        text="Sign and Issue Claim"
                        onClick={handleSign}
                        bgColor="bg-green-600"
                        textColor="text-white"
                        bghColor="bg-green-700"
                    />
                </>
            )}
            <Components.Separator />
            <div className="flex flex-col gap-3">

                <div className="flex gap-2 justify-between items-center">
                    <h2 className="text-lg font-semibold">Loaded Issued Claims</h2>
                    <div className="flex gap-2">
                        {!imported ? (
                            <Components.LabelInputButton
                                text="Load (.json)"
                                onChange={handleImport}
                                bgColor="bg-yellow-300"
                                bghColor="bg-yellow-400"
                                inline-block
                            />
                        ) : (
                            <Components.CustomButton
                                text="Save to Browser"
                                onClick={saveImported}
                                bgColor="bg-blue-600"
                                textColor="text-white"
                                bghColor="bg-blue-700"
                            />
                        )}
                    </div>
                </div>
                {imported ? (
                    <div className="space-y-4">
                        <div className="p-3 bg-yellow-300 rounded">
                            <div className="flex justify-between items-start">
                                <div className="flex justify-between items-start mb-4 w-full max-w-full">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <RecursiveObjectList data={imported} />
                                    </div>
                                    <div className="shrink-0">
                                        <Components.CustomButton
                                            text="X"
                                            onClick={clearImported}
                                            sm={true}
                                            textColor="text-black"
                                            minWidth=""
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Components.CustomButton
                                    text="QR Code"
                                    onClick={() => generateQRCode(imported)}
                                    sm={true}
                                />
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-600">No loaded claim.</p>
                )}
                <div className="flex gap-2 justify-between items-center">
                    <h2 className="text-lg font-semibold">Saved Issued Claims</h2>
                    <div className="flex gap-2">
                        {listStored.length > 0 && (
                            <Components.CustomButton
                                text="Clear All"
                                onClick={clearStorage}
                            />
                        )}
                    </div>
                </div>
                {listStored.length > 0 ? (
                    <div className="space-y-4">
                        {listStored.map((form, idx) => (
                            <div key={idx} className="p-3 bg-blue-600 rounded shadow-sm">
                                <div className="flex justify-between items-start text-white mb-4 w-full max-w-full">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        <RecursiveObjectList data={form} />
                                    </div>
                                    <div className="shrink-0">
                                        <Components.CustomButton
                                            text="X"
                                            onClick={() => removeStored(idx)}
                                            sm={true}
                                            textColor="text-black"
                                            minWidth=''
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Components.CustomButton
                                        text="QR Code"
                                        onClick={() => generateQRCode(form)}
                                        sm={true}
                                    />
                                    <Components.CustomButton
                                        text="Download File (.json)"
                                        onClick={() => handleDownload(form)}
                                        sm={true}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No saved forms.</p>
                )}
            </div>
        </div>
    );
}
