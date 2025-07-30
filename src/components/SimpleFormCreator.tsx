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
          <Components.CustomButton
              text="Add"
              onClick={addField}
              sm={true}
              bgColor="bg-green-600"
              textColor="text-white"
              bghColor="bg-green-700"
          />
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
        <Components.CustomButton
          text="Download Form (.json)"
          onClick={handleDownload}
          bgColor="bg-blue-600"
          textColor="text-white"
          bghColor="bg-blue-700"
        />
      )}
    </div>
  );
}
