// ... código anterior ...

return (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    onClick={handleBackdropClick}
    onKeyDown={handleKeyDown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="settings-modal-title"
  >
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 id="settings-modal-title" className="text-xl font-semibold">
          Configurações
        </h2>
        {/* ✅ BOTÃO CORRETO - substituindo a div problemática */}
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 p-1"
          aria-label="Fechar configurações"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      
      <div className="p-6 space-y-6">
        {/* ✅ BOTÕES CORRETOS - substituindo as divs problemáticas */}
        <div className="space-y-4">
          <button
            onClick={handleExport}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            Exportar Dados
          </button>
          
          <button
            onClick={handleImport}
            className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            Importar Dados
          </button>
          
          <button
            onClick={handleResetApp}
            className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            Resetar Aplicação
          </button>
        </div>

        {/* Configurações de Voz */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Configurações de Voz</h3>
          
          {/* ✅ EXEMPLO DE CORREÇÃO para parseFloat */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={voiceSettings.volume}
              onChange={(e) => handleVoiceSettingChange('volume', Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{voiceSettings.volume}</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Velocidade</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={voiceSettings.rate}
              onChange={(e) => handleVoiceSettingChange('rate', Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{voiceSettings.rate}</span>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Tom</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={voiceSettings.pitch}
              onChange={(e) => handleVoiceSettingChange('pitch', Number.parseFloat(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-500">{voiceSettings.pitch}</span>
          </div>

          <button
            onClick={resetVoiceSettings}
            className="w-full bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            type="button"
          >
            Redefinir Configurações de Voz
          </button>
        </div>
      </div>
    </div>
  </div>
);