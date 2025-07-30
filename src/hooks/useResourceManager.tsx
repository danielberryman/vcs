import { useState, useEffect } from 'react';

type ResourceValidator<T> = (data: any) => data is T;

interface UseResourceManagerOptions<T> {
    localStorageKey: string;
    validate: ResourceValidator<T>;
    mode?: 'single' | 'list'; // default: 'list'
}

export function useResourceManager<T>({
    localStorageKey,
    validate,
    mode = 'list',
}: UseResourceManagerOptions<T>) {
    const [imported, setImported] = useState<T | null>(null);
    const [stored, setStored] = useState<T[] | T | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const raw = localStorage.getItem(localStorageKey);
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (mode === 'single') {
                if (validate(parsed)) setStored(parsed);
            } else {
                const list = Array.isArray(parsed) ? parsed : [];
                const validList = list.filter(validate);
                setStored(validList);
            }
        } catch {
            console.warn(`Invalid data in localStorage key: ${localStorageKey}`);
        }
    }, [localStorageKey, validate, mode]);

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(reader.result as string);
                if (validate(parsed)) {
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

    const handleImportFromGenerate = (data: T) => {
        setImported(data);
    }

    const saveImported = () => {
        if (!imported) return;

        if (mode === 'single') {
            localStorage.setItem(localStorageKey, JSON.stringify(imported));
            setStored(imported);
        } else {
            const current = Array.isArray(stored) ? stored : [];
            const updated = [...current, imported];
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
