import React, { useState } from 'react';
import { Profile } from '../types';
import Icon from '../components/common/Icon';
import { User, PlusCircle, Trash2 } from 'lucide-react';

interface ProfileScreenProps {
  profiles: Profile[];
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>;
  onSelectProfile: (profile: Profile) => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ profiles, setProfiles, onSelectProfile }) => {
  const [newProfileName, setNewProfileName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProfile = () => {
    if (newProfileName.trim()) {
      const newProfile: Profile = {
        id: crypto.randomUUID(),
        name: newProfileName.trim(),
      };
      const updatedProfiles = [...profiles, newProfile];
      setProfiles(updatedProfiles);
      onSelectProfile(newProfile); // Automatically select the new profile
      setNewProfileName('');
      setIsCreating(false);
    }
  };
  
  const handleDeleteProfile = (e: React.MouseEvent, profileId: string) => {
    e.stopPropagation();
    if (window.confirm('Tem certeza que deseja apagar este perfil? Todos os dados associados a ele serão perdidos permanentemente.')) {
        // Clean up all data associated with this profile from localStorage
        Object.keys(window.localStorage).forEach(key => {
            if (key.startsWith(`${profileId}_`)) {
                window.localStorage.removeItem(key);
            }
        });
        
        // Remove the profile from the list
        setProfiles(profiles.filter(p => p.id !== profileId));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background-dark text-text-dark bg-gradient-to-br from-gray-900 via-background-dark to-gray-900 p-4 animate-fadeIn">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-wider text-text-light mb-2">Bem-vindo(a)</h1>
        <p className="text-lg text-subtle">Selecione ou crie um perfil para começar.</p>
      </div>

      <div className="w-full max-w-md">
        <div className="space-y-4">
          {profiles.map(profile => (
            <div
              key={profile.id}
              onClick={() => onSelectProfile(profile)}
              className="group relative flex items-center justify-between p-4 bg-surface-dark rounded-lg shadow-lg cursor-pointer transition-all duration-200 hover:bg-primary hover:shadow-primary/50 hover:scale-105"
            >
              <div className="flex items-center gap-4">
                <User className="text-brand-light" size={24} />
                <span className="text-lg font-semibold">{profile.name}</span>
              </div>
              <button
                onClick={(e) => handleDeleteProfile(e, profile.id)}
                className="p-2 text-subtle rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-400 transition-opacity"
                aria-label={`Deletar perfil ${profile.name}`}
              >
                  <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        {isCreating ? (
          <div className="mt-6 p-4 bg-surface-dark rounded-lg animate-slideInUp">
            <input
              type="text"
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Nome do Perfil"
              className="w-full p-3 bg-background-dark border border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:outline-none"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
            />
            <div className="flex justify-end gap-3 mt-3">
                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-subtle rounded-md hover:bg-gray-700">Cancelar</button>
                <button onClick={handleCreateProfile} disabled={!newProfileName.trim()} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50">Criar</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsCreating(true)}
            className="w-full mt-6 flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-600 rounded-lg text-subtle hover:text-white hover:border-primary transition-colors"
          >
            <PlusCircle size={24} />
            <span className="text-lg font-semibold">Adicionar Novo Perfil</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileScreen;