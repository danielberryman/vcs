import { useEffect, useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useLocation } from 'react-router-dom';
import { agent } from '../veramoAgent';
import Header from '../components/Header';
import Components from '../components';

function encodeVC(vc: any) {
    return btoa(JSON.stringify(vc));
}

function decodeVC(encoded: string) {
    try {
        return JSON.parse(atob(encoded));
    } catch {
        return null;
    }
}

function VCListTab() {
    const [vcFiles, setVCFiles] = useState<{
        fileName: string;
        data: string;
        title: string;
    }[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const existing = localStorage.getItem('peerplay-vcs');
        if (existing) setVCFiles(JSON.parse(existing));
    }, []);

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string);
                const updated = [...vcFiles, {
                    fileName: file.name,
                    data: parsed,
                    title: "",
                }];
                setVCFiles(updated);
                localStorage.setItem('peerplay-vcs', JSON.stringify(updated));
            } catch {
                alert('Invalid VC file');
            }
        };
        reader.readAsText(file);
    };

    function clearMyVcs() {
        localStorage.removeItem('peerplay-vcs');
        setVCFiles([]);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div className="">
            <div className="flex gap-2 justify-between">
                <h2 className="text-lg font-semibold">Uploaded VCs</h2>
                <div className="flex gap-2">
                    <label className="
                        inline-block 
                        px-4 py-1
                        bg-gray-100
                        rounded 
                        cursor-pointer
                        hover:bg-gray-200
                        text-center
                    ">
                        Select VC
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" />
                    </label>
                    {vcFiles.length > 0 && (
                        <button
                            onClick={clearMyVcs}
                            className="
                                px-4 py-1
                                bg-gray-100
                                rounded 
                                cursor-pointer
                                hover:bg-gray-200
                                text-center
                            "
                        >Clear My VCs</button>
                    )}
                </div>
            </div>
            {vcFiles.length > 0 ? (
                <>
                    {vcFiles.map((vc, i) => (
                        <div key={i} className="mb-6">
                            <h3 className="font-semibold">{vc.title}</h3>
                            <p className="">{vc.fileName}</p>
                            <QRCodeSVG
                                value={`${window.location.origin}/verify?vc=${encodeVC(vc.data)}`}
                                size={256}
                            />
                        </div>
                    ))}
                </>
            ) : (
                <p className="text-gray-600">No uploaded VCs.</p>
            )}
        </div>
    );
}

function VerificationTab() {
    const [vc, setVC] = useState<any>(null);
    const [status, setStatus] = useState<'pending' | 'valid' | 'invalid' | null>(null);

    const query = new URLSearchParams(useLocation().search);
    const encodedVC = query.get('vc');

    useEffect(() => {
        if (!encodedVC) return;

        const verify = async () => {
            const decoded = decodeVC(encodedVC);
            if (!decoded) {
                alert('Invalid VC');
                return;
            }

            setVC(decoded);
            setStatus('pending');

            try {
                const result = await agent.verifyCredential({ credential: decoded });
                setStatus(result.verified ? 'valid' : 'invalid');
            } catch (err) {
                console.error('Verification error:', err);
                setStatus('invalid');
            }
        };

        verify();
    }, [encodedVC]);;

    return (
        <div className="">
            <h2 className="text-xl font-bold">Verification Result</h2>

            {status === 'pending' && <p>Verifying VC...</p>}
            {status === 'valid' && <p className="text-green-600 font-semibold">✅ VC is valid</p>}
            {status === 'invalid' && <p className="text-red-600 font-semibold">❌ VC is invalid</p>}

            {vc ? (
                <pre className="bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">
                    {JSON.stringify(vc, null, 2)}
                </pre>
            ) : (
                <p>No VC loaded.</p>
            )}
        </div>
    );
}

export default function Verify() {
    const [tab, setTab] = useState<'list' | 'check'>('list');
    const location = useLocation();

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        if (query.get('vc')) {
            setTab('check');
        }
    }, [location.search]);

    return (
        <div className="">
            <Components.Header title="Verification" />
            <Components.Separator />
            <div className="flex mb-4 gap-2">
                <button
                    className={`
                        px-4 py-2 cursor-pointer rounded ${tab === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                    onClick={() => setTab('list')}
                >
                    My VCs
                </button>
                <button
                    className={`
                        px-4 py-2 cursor-pointer rounded ${tab === 'check' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'}
                    `}
                    onClick={() => setTab('check')}
                >
                    Verify QR VC
                </button>
            </div>

            {tab === 'list' ? <VCListTab /> : <VerificationTab />}
        </div>
    );
}
