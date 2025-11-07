import React, { createContext } from 'react';
import { Profile } from '../types';

interface ProfileContextType {
  activeProfile: Profile | null;
}

export const ProfileContext = createContext<ProfileContextType>({
  activeProfile: null,
});

export const ProfileProvider: React.FC<{ children: React.ReactNode; activeProfile: Profile | null }> = ({ children, activeProfile }) => {
  return (
    <ProfileContext.Provider value={{ activeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};
