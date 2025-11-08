import React, { useMemo } from 'react';
import { Sentence, SymbolData } from '../../types';
import { categories as predefinedCategories } from '../../constants';
import Icon from '../common/Icon';

interface AnalyticsDashboardProps {
  savedPhrases: Sentence[];
  customSymbols: SymbolData[];
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ savedPhrases, customSymbols }) => {
    
    const allSymbols = useMemo(() => {
        const defaultSymbols = predefinedCategories.flatMap(cat => cat.symbols.map(s => ({...s, id: s.id, name: s.name, emoji: s.icon, category: s.category} as SymbolData)));
        return [...defaultSymbols, ...customSymbols.filter(Boolean)];
    }, [customSymbols]);

    const stats = useMemo(() => {
        // Filter out invalid data to prevent crashes from malformed localStorage entries.
        const validPhrases = savedPhrases.filter(p => Array.isArray(p));
        const totalPhrases = validPhrases.length;

        if (totalPhrases === 0) {
            return {
                totalPhrases: 0,
                avgLength: 0,
                uniqueVocab: 0,
                categoryUsage: {} as { [key: string]: number },
                symbolUsage: {} as { [key: string]: number },
            };
        }
        
        // Ensure all "symbols" are valid objects before processing them.
        const allSymbolsInPhrases = validPhrases.flat().filter(symbol => 
            symbol && typeof symbol === 'object' && 'id' in symbol && 'name' in symbol
        );

        const avgLength = totalPhrases > 0 ? allSymbolsInPhrases.length / totalPhrases : 0;
        const uniqueVocab = new Set(allSymbolsInPhrases.map(s => s.id)).size;

        const categoryUsage: { [key: string]: number } = {};
        const symbolUsage: { [key: string]: number } = {};
        
        allSymbolsInPhrases.forEach(symbol => {
            const symbolInfo = allSymbols.find(s => s && s.id === symbol.id);
            if (symbolInfo) {
                const categoryName = predefinedCategories.find(c => c.id === symbolInfo.category)?.name || 'Personalizados';
                categoryUsage[categoryName] = (categoryUsage[categoryName] || 0) + 1;
            }
            symbolUsage[symbol.name] = (symbolUsage[symbol.name] || 0) + 1;
        });

        return {
            totalPhrases,
            avgLength: parseFloat(avgLength.toFixed(1)),
            uniqueVocab,
            categoryUsage,
            symbolUsage,
        };
    }, [savedPhrases, allSymbols]);

    // FIX: The sort function was causing a type error with parameter destructuring.
    // Using direct array access helps TypeScript correctly infer the types.
    // FIX: Add explicit types to sort callback parameters to resolve type inference issues.
    const topCategories = Object.entries(stats.categoryUsage).sort((a: [string, number], b: [string, number]) => b[1] - a[1]).slice(0, 5);
    // FIX: The sort function was causing a type error with parameter destructuring.
    // Using direct array access helps TypeScript correctly infer the types.
    // FIX: Add explicit types to sort callback parameters to resolve type inference issues.
    const topSymbols = Object.entries(stats.symbolUsage).sort((a: [string, number], b: [string, number]) => b[1] - a[1]).slice(0, 5);
    
    const handlePrint = () => {
        window.print();
    };

    const handleExportJson = () => {
        const dataToExport = {
            savedPhrases,
            customSymbols,
        };

        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'meu-mundo-em-simbolos-dados.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="text-text-dark">
            <style>
                {`
                @media print {
                    body {
                        background: #fff;
                        color: #000;
                    }
                    body * { 
                        visibility: hidden; 
                    }
                    .print-container, .print-container * { 
                        visibility: visible; 
                    }
                    .print-container { 
                        position: absolute; 
                        left: 20px; 
                        top: 20px; 
                        width: calc(100% - 40px);
                    }
                    .no-print { display: none; }
                    .print-bg { background-color: #f3f4f6 !important; }
                    .print-text { color: #111827 !important; }
                    .print-subtle { color: #6b7280 !important; }
                }
                `}
            </style>
            <div className="print-container">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-text-light print-text">Relatório de Desempenho</h2>
                        <p className="text-subtle print-subtle">Resumo da atividade de comunicação.</p>
                    </div>
                     <div className="no-print flex flex-col sm:flex-row items-end sm:items-center gap-2">
                        <button onClick={handleExportJson} className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all text-sm">
                            <Icon name="download" size={16} />
                            Exportar JSON
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-2 px-3 py-2 bg-secondary text-white rounded-lg shadow-md hover:bg-secondary-dark transition-all text-sm">
                            <Icon name="printer" size={16} />
                            Imprimir Relatório
                        </button>
                    </div>
                </div>

                {savedPhrases.length === 0 ? (
                    <p className="text-center py-10 text-subtle print-subtle">Não há dados suficientes para gerar um relatório. Comece salvando algumas frases.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <StatCard title="Frases Salvas" value={stats.totalPhrases} />
                            <StatCard title="Média de Símbolos/Frase" value={stats.avgLength} />
                            <StatCard title="Vocabulário Único" value={stats.uniqueVocab} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <ChartCard title="Categorias Mais Usadas" data={topCategories} />
                            <ChartCard title="Símbolos Mais Usados" data={topSymbols} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

const StatCard: React.FC<{title: string; value: number | string}> = ({ title, value }) => (
    <div className="bg-background-dark p-4 rounded-lg shadow print-bg">
        <p className="text-sm text-subtle print-subtle">{title}</p>
        <p className="text-3xl font-bold text-text-light print-text">{value}</p>
    </div>
);

const ChartCard: React.FC<{title: string; data: [string, number][]}> = ({ title, data }) => {
    const maxValue = Math.max(...data.map(d => d[1]), 1);
    return (
        <div className="bg-background-dark p-4 rounded-lg shadow print-bg">
            <h3 className="text-lg font-semibold mb-4 print-text">{title}</h3>
            <div className="space-y-3">
                {data.map(([label, value]) => (
                    <div key={label} className="flex items-center gap-3 text-sm">
                        <span className="w-28 truncate text-right text-subtle print-subtle">{label}</span>
                        <div className="flex-1 bg-surface-dark rounded-full h-5">
                            <div 
                                className="bg-gradient-to-r from-primary to-brand h-5 rounded-full flex items-center justify-end px-2 text-white font-bold text-xs"
                                style={{ width: `${(value / maxValue) * 100}%` }}
                            >
                                {value}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AnalyticsDashboard;