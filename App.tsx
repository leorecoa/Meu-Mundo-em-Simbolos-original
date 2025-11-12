import React, { useState } from 'react';
import { SettingsModal } from '@/components/SettingsModal';

function App() {
  const [isModalOpen, setModalOpen] = useState(false);

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div style={styles.container}>
      <h1>Meu Mundo em Símbolos</h1>
      <button onClick={openModal} style={styles.button}>
        Abrir Configurações de Voz
      </button>

      <SettingsModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '2rem', fontFamily: 'sans-serif', textAlign: 'center' },
  button: { padding: '10px 20px', fontSize: '1rem', cursor: 'pointer' }
};

export default App;