import React from 'react';

interface RecursiveObjectListProps {
  data: Record<string, any>;
}

const RecursiveObjectList: React.FC<RecursiveObjectListProps> = ({ data }) => {
  const render = (key: string, value: any): React.ReactNode => {
    const valueIsObject = typeof value === 'object' && !Array.isArray(value) && value !== null;

    return (
        <li key={key} className={`mb-1 ${!valueIsObject && !Array.isArray(value) && "pl-5 flex gap-2"}`}>
            <strong>{key}:</strong>
            {valueIsObject ? (
                <RecursiveObjectList data={value} />
            ) : (
                <>
                    {Array.isArray(value) ? (
                        <ol className="pl-5">
                            {value.map((v) => (
                                <li>
                                    <span className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                                        {String(v)}
                                    </span>
                                </li>
                            ))} 
                        </ol>
                    ) : (
                        <span className="block overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
                            {String(value)}
                        </span>
                    )}
                </>
            )}
        </li>
    );
  };

  return (
    <ul>
      {Object.entries(data).map(([key, value]) => {
        return render(key, value);
      })}
    </ul>
  );
};

export default RecursiveObjectList;
