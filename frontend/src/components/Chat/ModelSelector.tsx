import { useState, useEffect } from 'react';
import { ModelType } from './types';

type ModelSelectorProps = {
  selectedModel: ModelType;
  onModelSelect: (model: ModelType) => void;
};

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps) {
  const [models, setModels] = useState<ModelType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chat/models`);
        if (!response.ok) {
          throw new Error('Failed to fetch models');
        }
        const data = await response.json();
        setModels(data.models);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load models');
      }
    };

    fetchModels();
  }, []);

  if (error) {
    return <div className="text-red-500 dark:text-red-400">Error loading models: {error}</div>;
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="model-select" className="font-medium">
        Model:
      </label>
      <select
        id="model-select"
        value={selectedModel}
        onChange={(e) => onModelSelect(e.target.value as ModelType)}
        className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>
  );
} 