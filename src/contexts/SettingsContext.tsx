import React, { createContext, useContext, useEffect, useState } from 'react';

interface SettingsContextType {
  compactMode: boolean;
  setCompactMode: (value: boolean) => void;
  liveTelemetry: boolean;
  setLiveTelemetry: (value: boolean) => void;
  privacyShield: boolean;
  setPrivacyShield: (value: boolean) => void;
  lowStockAlerts: boolean;
  setLowStockAlerts: (value: boolean) => void;
  procurementUpdates: boolean;
  setProcurementUpdates: (value: boolean) => void;
  emailRelay: boolean;
  setEmailRelay: (value: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [compactMode, setCompactMode] = useState(() => localStorage.getItem('compactMode') === 'true');
  const [liveTelemetry, setLiveTelemetry] = useState(() => localStorage.getItem('liveTelemetry') !== 'false');
  const [privacyShield, setPrivacyShield] = useState(() => localStorage.getItem('privacyShield') === 'true');
  const [lowStockAlerts, setLowStockAlerts] = useState(() => localStorage.getItem('lowStockAlerts') !== 'false');
  const [procurementUpdates, setProcurementUpdates] = useState(() => localStorage.getItem('procurementUpdates') !== 'false');
  const [emailRelay, setEmailRelay] = useState(() => localStorage.getItem('emailRelay') !== 'false');

  useEffect(() => {
    localStorage.setItem('compactMode', compactMode.toString());
    if (compactMode) {
      document.documentElement.classList.add('compact-mode');
    } else {
      document.documentElement.classList.remove('compact-mode');
    }
  }, [compactMode]);

  useEffect(() => localStorage.setItem('liveTelemetry', liveTelemetry.toString()), [liveTelemetry]);
  useEffect(() => localStorage.setItem('privacyShield', privacyShield.toString()), [privacyShield]);
  useEffect(() => localStorage.setItem('lowStockAlerts', lowStockAlerts.toString()), [lowStockAlerts]);
  useEffect(() => localStorage.setItem('procurementUpdates', procurementUpdates.toString()), [procurementUpdates]);
  useEffect(() => localStorage.setItem('emailRelay', emailRelay.toString()), [emailRelay]);

  return (
    <SettingsContext.Provider
      value={{
        compactMode,
        setCompactMode,
        liveTelemetry,
        setLiveTelemetry,
        privacyShield,
        setPrivacyShield,
        lowStockAlerts,
        setLowStockAlerts,
        procurementUpdates,
        setProcurementUpdates,
        emailRelay,
        setEmailRelay,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
