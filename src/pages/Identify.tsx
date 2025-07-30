import { useEffect, useState } from 'react';
import {
    type StoredIdentity,
    isStoredIdentity,
    handleGenerate,
} from '../identity';
import Components from '../components/index';
import { useResourceManager } from '../hooks/useResourceManager';

export default function Identify() {
    const {
        imported,
        stored,
        handleImport,
        saveImported,
        clearImported,
        clearStorage,
    } = useResourceManager<StoredIdentity>({
        localStorageKey: 'peerplay-identity',
        validate: isStoredIdentity,
        mode: 'single',
    });

    const singleStored = Array.isArray(stored) ? null : stored;
    const [message, setMessage] = useState<string>("");

    useEffect(() => {
        setTimeout(() => {
            setMessage("");
        }, 10000);
    }, [message]);

    return (
        <div className="">
            <Components.Header title="Manage Your Identity" />
            <Components.Separator />
            {!singleStored && !imported && (
                <div className="flex gap-2">
                    <Components.CustomButton
                        text="Generate Identity (DID)"
                        onClick={() => handleGenerate(setMessage)}
                        bgColor="bg-green-600"
                        textColor="text-white"
                        bghColor="bg-green-700"
                    />
                    <Components.LabelInputButton
                        text="Import Identity File (DID - .json)"
                        onChange={handleImport}
                        bgColor="bg-yellow-300"
                        bghColor="bg-yellow-400"
                        inline-block
                    />
                </div>
            )}

            {message && (
                <p className="mt-4">{message}</p>
            )}

            {(singleStored || imported) && (
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Your DID:</h2>
                    <p className={`
                        ${singleStored?.did && 'bg-blue-600 hover:bg-blue-700 text-white'}
                        ${imported?.did && 'bg-yellow-300 hover:bg-yellow-400'} p-2 rounded w-full break-words
                    `}>{
                        singleStored?.did || imported?.did}
                    </p>
                    <div className="flex gap-2">
                        {!singleStored && (
                            <Components.CustomButton
                                text="Save to Browser"
                                onClick={saveImported}
                                bgColor="bg-blue-600"
                                textColor="text-white"
                                bghColor="bg-blue-700"
                            />
                        )}
                        <Components.CustomButton 
                            text="Clear"
                            onClick={() => {
                                clearStorage();
                                clearImported();
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Ok now I want to adapt the same logic for identity here for the importing and creating of forms as vcs signed by yourself. Basically you should manually create them through a simple form that you can configure. Let's keep that part really simple. You can define any number of fields and simply set the name of each property. And enforce json field key rules. Then you can create, sign with your identity as a vc and export it. Then you have to manually load that form to a list of vcs that can be used in the attest 