import { useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

export function useScanQRCode(onScan: (data: any) => void) {
  const containerId = 'qr-reader';

  const QRScanner = () => {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
      if (scannerRef.current) return; // prevent re-init

      scannerRef.current = new Html5QrcodeScanner(containerId, {
        fps: 10,
        qrbox: 250,
      }, undefined);

      scannerRef.current.render(
        (decodedText) => {
          try {
            const parsed = JSON.parse(decodedText);
            onScan(parsed);
            scannerRef.current?.clear();
          } catch (err) {
            alert('Invalid QR content');
          }
        },
        (err) => {
          // Silent on scan failures
        }
      );

      return () => {
        scannerRef.current?.clear().catch(() => {});
      };
    }, [onScan]);

    return <div id={containerId} className="rounded border p-2" />;
  };

  return { QRScanner };
}
