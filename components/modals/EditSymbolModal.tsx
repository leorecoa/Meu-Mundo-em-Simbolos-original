import React, { useState, useEffect } from 'react';
import { SymbolData } from '../../types';
import Icon from '../common/Icon';

interface EditSymbolModalProps {
  symbol: SymbolData;
  onSave: (updatedSymbol: SymbolData) => void;
  onClose: () => void;
}

const EditSymbolModal: React.FC<EditSymbolModalProps> = ({ symbol, onSave, onClose }) => {
    const [name, setName] = useState(symbol.name);
    
    useEffect(() => {
        setName(symbol.name);
    }, [symbol]);

    const handleSave = () => {
        if (name.trim()) {
            onSave({ ...symbol, name: name.trim(), speechText: name.trim() });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-text-light dark:text-text-dark">Editar Símbolo</h2>
                    <button onClick={onClose} className="text-subtle hover:text-text-light dark:hover:text-text-dark">
                        <Icon name="close" size={24} />
                    </button>
                </div>
                <div className="flex flex-col gap-4">
                    {symbol.imageUrl && <img src={symbol.imageUrl} alt={symbol.name} className="w-32 h-32 object-cover rounded-lg self-center" />}
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nome do símbolo"
                        className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-surface-light dark:bg-surface-dark focus:ring-2 focus:ring-primary focus:outline-none"
                    />
                    <div className="flex justify-end gap-3">
                        <button onClick={onClose} className="px-4 py-2 rounded-md text-subtle hover:bg-gray-100 dark:hover:bg-gray-700">Cancelar</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">Salvar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditSymbolModal;
