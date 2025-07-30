import { useState, useEffect } from 'react';

type IResourceValidator<TI> = (data: any) => data is TI;
type SResourceValidator<TS> = (data: any) => data is TS;

interface UseResourceManagerOptions<TI, TS> {
    localStorageKey: string;
    validateI: IResourceValidator<TI>;
    validateS: SResourceValidator<TS>;
    mode?: 'single' | 'list'; // default: 'list'
}

export function useResourceManager<TI, TS>({
    localStorageKey,
    validateI,
    validateS,
    mode = 'list',
}: UseResourceManagerOptions<TI, TS>) {
    const [imported, setImported] = useState<TI | null>(null);
    const [stored, setStored] = useState<TS[] | TS | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const raw = localStorage.getItem(localStorageKey);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (mode === 'single') {
                if (validateS(parsed)) setStored(parsed);
            } else {
                const list = Array.isArray(parsed) ? parsed : [];
                const validList = list.filter(validateS);
                setStored(validList);
            }
        } catch {
            console.warn(`Invalid data in localStorage key: ${localStorageKey}`);
        }
    }, [localStorageKey, validateS, mode]);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string);
                if (validateI(parsed)) {
                    setImported(parsed);
                } else {
                    alert('Invalid file format');
                }
            } catch {
                alert('Error reading file');
            }
        };
        reader.readAsText(file);
    };

    const handleImportFromGenerate = (data: TI) => {
        setImported(data);
    }

    const saveImported = (data: TS) => {
        if (!data) return;

        if (mode === 'single') {
            localStorage.setItem(localStorageKey, JSON.stringify(data));
            setStored(data);
        } else {
            const current = Array.isArray(stored) ? stored : [];
            const updated = [...current, data];
            localStorage.setItem(localStorageKey, JSON.stringify(updated));
            setStored(updated);
        }

        setImported(null);
    };

    const clearImported = () => setImported(null);

    const clearStorage = () => {
        localStorage.removeItem(localStorageKey);
        setStored(mode === 'list' ? [] : null);
    };

    const removeStored = (i: number) => {
        if (mode !== 'list') return; // only applies to list mode
        if (!Array.isArray(stored)) return;

        const updated = stored.filter((_, index) => index !== i);
        localStorage.setItem(localStorageKey, JSON.stringify(updated));
        setStored(updated);
    };

    return {
        imported,
        stored,
        handleImport,
        handleImportFromGenerate,
        saveImported,
        clearImported,
        clearStorage,
        removeStored,
    };
}
