import { useState } from 'react';
import Components from '.';

type SimpleField = {
  name: string;
};

export default function SimpleFormCreator() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fields, setFields] = useState<SimpleField[]>([]);
  const [newFieldName, setNewFieldName] = useState('');

  const addField = () => {
    if (newFieldName.trim()) {
      setFields([...fields, { name: newFieldName.trim() }]);
      setNewFieldName('');
    }
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleDownload = () => {
    const form = {
      id: title.toLowerCase().replace(/\s+/g, '-'),
      title,
      description,
      fields: fields.map((f) => ({
        name: f.name,
        type: 'string',
      })),
    };

    const blob = new Blob([JSON.stringify(form, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${form.id}.json`;
    a.click();
  };

  return (
    <div className="">
      <h2 className="text-xl font-bold mb-4">Create a VC Form Template</h2>

      <p className="pb-2">A <strong>Verifiable Credential (VC)</strong> is a secure digital statement—like an ID card or certificate—that can be shared and independently verified. It's cryptographically signed by the issuer, proving that the information hasn't been tampered with.</p>
      <p className="pb-4">Creating your <strong>own VC form</strong> lets you define the <strong>title, description, and custom fields</strong> so you can issue credentials tailored to your specific use case—whether it's a membership badge, a course completion certificate, or a peer endorsement. This gives you full control over what information is captured, how it's displayed, and what it means to your community.</p>

      <div className="mb-4">
        <label className="block font-semibold">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="e.g., Trusted Actor"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
          placeholder="Brief description of what this form represents"
        />
      </div>

      <div className="mb-4">
        <label className="block font-semibold">Add Field</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            placeholder="Field name (e.g., reputation)"
            className="flex-1 px-3 py-2 border rounded"
          />
          <button
            onClick={addField}
            className="bg-green-600 text-white cursor-pointer px-4 py-2 rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
      </div>

      {fields.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Fields:</h4>
          <ul className="space-y-1">
            {fields.map((field, i) => (
              <li key={i} className="flex gap-2 justify-between">
                <p className="bg-gray-100 w-full rounded px-4 py-2">{field.name}</p>
                <Components.CustomButton 
                  text="Delete"
                  onClick={() => removeField(i)}
                  bgColor="bg-red-600"
                  textColor="text-white"
                  bghColor="bg-red-700"
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      {title && fields.length > 0 && (
        <button
          onClick={handleDownload}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
        >
          Download Form JSON
        </button>
      )}
    </div>
  );
}
