import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal.tsx';
import Header from './components/Header';

// Define e exporta o tipo para as telas, resolvendo o erro de importação no Header.
export type ScreenView = 'symbols' | 'text' | 'therapist';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeScreen, setActiveScreen] = useState<ScreenView>('symbols');

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div style={styles.main}>
      <Header
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
        onOpenSettings={openModal}
      />
      <div style={styles.container}>
        {/* Renderiza o conteúdo com base na tela ativa */}
        {activeScreen === 'symbols' && <div>Tela de Símbolos</div>}
        {activeScreen === 'text' && <div>Tela de Texto</div>}
        {activeScreen === 'therapist' && <div>Tela do Acompanhante</div>}
      </div>
      <SettingsModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    backgroundColor: '#333',
    color: 'white'
  },
  container: {
    padding: '2rem',
    textAlign: 'center',
    flex: 1
  },
};

export default App;