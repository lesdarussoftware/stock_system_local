import React, { useState, useEffect, ReactNode } from 'react';
import Webcam from 'react-webcam';
import { BrowserMultiFormatReader } from '@zxing/library';

import { BarcodeReaderContext } from '../contexts/BarcodeReaderContext';

type BarcodeReaderProviderProps = {
    children: ReactNode;
};

export function BarcodeReaderProvider({ children }: BarcodeReaderProviderProps) {

    const [barcode, setBarcode] = useState<string | null>(null);
    const [isCameraActive, setIsCameraActive] = useState(false);
    const [scannerEnabled, setScannerEnabled] = useState(false);

    const videoRef = React.useRef<Webcam>(null);
    const codeReader = new BrowserMultiFormatReader();

    const startCamera = () => {
        setIsCameraActive(true);
    };

    const stopCamera = () => {
        setIsCameraActive(false);
        codeReader.reset();
    };

    const handleDecode = (result: string) => {
        setBarcode(result);
        stopCamera(); // Detener la cámara después de escanear.
    };

    const useScanner = (enable: boolean) => {
        setScannerEnabled(enable);
    };

    useEffect(() => {
        if (scannerEnabled) {
            const handleKeyPress = (e: KeyboardEvent) => {
                // Supongamos que el lector emula un teclado.
                if (e.key === 'Enter') {
                    console.log(`Código escaneado: ${barcode}`);
                } else {
                    setBarcode((prev) => (prev || '') + e.key);
                }
            };

            window.addEventListener('keypress', handleKeyPress);
            return () => window.removeEventListener('keypress', handleKeyPress);
        }
    }, [scannerEnabled, barcode]);

    useEffect(() => {
        if (isCameraActive && videoRef.current) {
            const videoElement = videoRef.current.video as HTMLVideoElement;

            const scan = async () => {
                try {
                    const result = await codeReader.decodeFromVideoElement(videoElement);
                    if (result) handleDecode(result.getText());
                } catch (error) {
                    // Continuar intentando leer
                }
            };

            const interval = setInterval(scan, 500);
            return () => clearInterval(interval);
        }
    }, [isCameraActive]);

    return (
        <BarcodeReaderContext.Provider value={{ barcode, startCamera, stopCamera, useScanner }}>
            {children}
            {isCameraActive && <Webcam ref={videoRef} style={{ display: 'none' }} />}
        </BarcodeReaderContext.Provider>
    );
}
