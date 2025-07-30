// pages/download-vc.tsx (or /routes/download-vc.tsx depending on setup)
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Or use `next/router` if in Next.js

export default function DownloadVC() {
    const [params] = useSearchParams();
    const vcParam = params.get('vc');

    useEffect(() => {
        if (!vcParam) return;

        try {
            const jsonString = atob(vcParam); // decode base64
            const decodedVC = JSON.parse(jsonString); // parse JSON

            const blob = new Blob([JSON.stringify(decodedVC, null, 2)], {
                type: 'application/json',
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'attested-vc.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Invalid VC data', err);
        }
    }, [vcParam]);

    return (
        <div className="p-6 text-center">
            <h2 className="text-xl font-semibold">Downloading VC...</h2>
            <p className="text-sm text-gray-500">You can close this window after download completes.</p>
        </div>
    );
}
