import React, { useState, useRef } from 'react';
import Icon from '../common/Icon';

interface AddCustomSymbolProps {
  onAdd: (name: string, imageBase64: string) => void;
}

const AddCustomSymbol: React.FC<AddCustomSymbolProps> = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    if (name.trim() && image) {
      onAdd(name.trim(), image);
      setName('');
      setImage(null);
      if(fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-background-light dark:bg-background-dark">
      <h3 className="font-semibold text-text-light dark:text-text-dark mb-2">Adicionar Novo Símbolo</h3>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div 
          className="w-24 h-24 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"
          onClick={() => fileInputRef.current?.click()}
        >
          {image ? (
            <img src={image} alt="Preview" className="w-full h-full object-cover rounded-lg"/>
          ) : (
            <div className="text-center text-subtle">
              <Icon name="upload" size={24}/>
              <span className="text-xs mt-1 block">Imagem</span>
            </div>
          )}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleImageChange} 
            className="hidden"
          />
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome do símbolo"
          className="flex-grow p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-surface-light dark:bg-surface-dark focus:ring-2 focus:ring-primary focus:outline-none w-full"
        />
        <button
          onClick={handleAddClick}
          disabled={!name.trim() || !image}
          className="px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary-dark transition-colors"
        >
          <Icon name="plus" className="inline sm:mr-2" size={16}/>
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>
    </div>
  );
};

export default AddCustomSymbol;
