import SimpleFormCreator from '../components/SimpleFormCreator';
import Components from '../components';
import { useResourceManager } from '../hooks/useResourceManager';

type VCFormDefinition = {
  id: string;
  title: string;
  description?: string;
  fields: {
    name: string;
    type: string;
    enum?: string[];
  }[];
};

export const isVCFormDefinition = (data: any): data is VCFormDefinition => {
  return (
    typeof data === 'object' &&
    typeof data.id === 'string' &&
    typeof data.title === 'string' &&
    Array.isArray(data.fields)
  );
};

export default function Forms() {
  const {
    imported,
    stored,
    handleImport,
    saveImported,
    clearImported,
    clearStorage,
    removeStored,
  } = useResourceManager<VCFormDefinition>({
    localStorageKey: 'peerplay-forms',
    validate: isVCFormDefinition,
    mode: 'list',
  });

  const listStored = Array.isArray(stored) && stored.length > 0 ? stored : [];

  const handleDownload = (form: VCFormDefinition) => {
    const blob = new Blob([JSON.stringify(form, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.id || form.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
  };

  return (
    <div>
      <Components.Header title="VC Forms" />
      <Components.Separator />
      <div className="flex flex-col gap-3">
        <div className="flex gap-2 justify-between items-center">
          <h2 className="text-lg font-semibold">Loaded Form</h2>
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
            {imported && (
              <Components.CustomButton
                text="Clear"
                onClick={clearImported}
              />
            )}
          </div>
        </div>

        {imported ? (
          <div className="space-y-4">
            <div className="p-3 pt-2 bg-yellow-300 rounded">
              <h2 className="text-lg font-semibold">{imported.title}</h2>
              <p className="text-sm text-gray-600">{imported.description}</p>
              <ul className="text-sm mt-2">
                {imported.fields.map((field, i) => (
                  <li key={i}>• <strong>{field.name}</strong> ({field.type})</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No loaded form.</p>
        )}

        <div className="flex gap-2 justify-between items-center">
          <h2 className="text-lg font-semibold">Saved Forms</h2>
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
                <h2 className="text-lg text-white font-semibold">{form.title}</h2>
                <p className="text-sm text-white">{form.description}</p>
                <ul className="text-sm text-white pt-2 pb-4">
                  {form.fields.map((field, i) => (
                    <li key={i}>• <strong>{field.name}</strong> ({field.type})</li>
                  ))}
                </ul>
                <div className="flex gap-2">
                  <Components.CustomButton
                    text="Download File (.json)"
                    onClick={() => handleDownload(form)}
                    sm={true}
                  />
                  <Components.CustomButton
                    text="X"
                    onClick={() => removeStored(idx)}
                    sm={true}
                    bgColor="bg-red-500"
                    textColor="text-white"
                    bghColor="bg-red-600"
                    minWidth=''
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No saved forms.</p>
        )}
      </div>
      <hr className="my-6" />
      <SimpleFormCreator />
    </div>
  );
}
