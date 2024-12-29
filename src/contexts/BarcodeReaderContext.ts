import { createContext } from "react";

type BarcodeReaderContextType = {
    barcode: string | null;
    startCamera: () => void;
    stopCamera: () => void;
    useScanner: (enable: boolean) => void;
};

export const BarcodeReaderContext = createContext<BarcodeReaderContextType | undefined>(undefined);