import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import { agent } from '../veramoAgent';
import Components from '../components';
import { useResourceManager } from '../hooks/useResourceManager';
import { type VerifiableCredential } from '@veramo/core';
import { useGlobalModal } from '../hooks/useGlobalModal';
import { FaCamera } from 'react-icons/fa';
import RecursiveObjectList from '../components/RecursiveObjectList';

const BASE_URL = 'http://192.168.1.231:5173/';

type VCFileDefinition = {
    verified: boolean;
    data: VerifiableCredential;
};

export const isVCFileDefinition = (data: any): data is VCFileDefinition => {
    return (
        typeof data === 'object' &&
        typeof data.verified === 'boolean' &&
        typeof data.data === 'object'
    );
};

export default function Verify() {
    const {
        imported,
        stored,
        handleImport,
        handleImportFromGenerate,
        saveImported,
        clearImported,
        clearStorage,
        removeStored,
    } = useResourceManager<VCFileDefinition>({
        localStorageKey: 'peerplay-vcs',
        validate: isVCFileDefinition,
        mode: 'list',
    });
    const listStored = Array.isArray(stored) && stored.length > 0 ? stored : [];

    const [status, setStatus] = useState<'pending' | 'valid' | 'invalid' | null>(null);

    const query = new URLSearchParams(useLocation().search);
    const [encodedVC, setEncodedVC] = useState<string>(query.get('vc') || "");

    useEffect(() => {
        if (!encodedVC) return;

        const verify = async () => {
            const decodedVC = JSON.parse(encodedVC);
            setStatus('pending');

            try {
                const result = await agent.verifyCredential({ credential: decodedVC });
                handleImportFromGenerate({
                    verified: result.verified,
                    data: decodedVC as VerifiableCredential,
                });
                setStatus(result.verified ? 'valid' : 'invalid');
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('invalid');
            }
        };

        verify();
    }, [encodedVC]);

    const { showModal, hideModal } = useGlobalModal();

    const generateQRCode = (claim: VCFileDefinition) => {
        const encoded = encodeURIComponent(JSON.stringify(claim.data));
        console.log(`${BASE_URL}verify?vc=${encoded}`);

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

    const handleDownload = (form: VCFileDefinition) => {
        const blob = new Blob([JSON.stringify({ ...form, verified: false }, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "valid_vc.json";
        a.click();
    };

    return (
        <div>
            <Components.Header title="Verify" />
            <div className="pt-4">
                {!imported && (
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold">
                            <i>Scan a claim QR with your camera to verify.</i>
                        </h2>
                        <FaCamera />
                        {/* <QRScanner /> */}
                    </div>
                )}
            </div>
            <Components.Separator />
            <div className="flex flex-col gap-3">
                <div className="flex gap-2 justify-between items-center">
                    <h2 className="text-lg font-semibold">Loaded VCs</h2>
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
                                onClick={() => {
                                    setStatus(null);
                                    saveImported();
                                }}
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
                                <div className="flex justify-between items-start mb-4 w-full max-w-full gap-2">
                                    <div className="flex-1 min-w-0 overflow-hidden">
                                        {status ? (
                                            <div className="flex items-center gap-2 mb-4">
                                                <h2 className="text-xl font-bold">Verification Result</h2>
                                                <div className="bg-gray-100 rounded p-2">
                                                    {status === 'pending' && <p>Verifying VC...</p>}
                                                    {status === 'valid' && <p className="text-green-600 font-semibold">✅ VC is valid</p>}
                                                    {status === 'invalid' && <p className="text-red-600 font-semibold">❌ VC is invalid</p>}
                                                </div>
                                            </div>
                                        ) : (
                                            <Components.CustomButton
                                                text="Verify"
                                                onClick={() => setEncodedVC(JSON.stringify(imported.data))}
                                                bgColor="bg-green-600"
                                                textColor="text-white"
                                                bghColor="bg-green-700"
                                            />
                                        )}
                                        <RecursiveObjectList data={imported.data} />
                                    </div>
                                    <div className="shrink-0">
                                        <Components.CustomButton
                                            text="X"
                                            onClick={() => {
                                                setStatus(null);
                                                setEncodedVC("");
                                                clearImported();
                                            }}
                                            sm={true}
                                            textColor="text-black"
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
                    <h2 className="text-lg font-semibold">Saved VCs</h2>
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
                                        <div className="flex items-center gap-2 mb-4">
                                            <h2 className="text-xl font-bold">Verification Result</h2>
                                            <div className="bg-gray-100 rounded p-2">
                                                {status === 'pending' && <p>Verifying VC...</p>}
                                                {status === 'valid' && <p className="text-green-600 font-semibold">✅ VC is valid</p>}
                                                {status === 'invalid' && <p className="text-red-600 font-semibold">❌ VC is invalid</p>}
                                            </div>
                                        </div>
                                        <RecursiveObjectList data={form.data} />
                                    </div>
                                    <div className="shrink-0">
                                        <Components.CustomButton
                                            text="X"
                                            onClick={() => removeStored(idx)}
                                            sm={true}
                                            textColor="text-black"
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
