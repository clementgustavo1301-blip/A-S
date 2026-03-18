'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface SidebarContextType {
  isExpanded: boolean;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextType>({
  isExpanded: false,
  toggle: () => {},
});

export function useSidebar() {
  return useContext(SidebarContext);
}

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SidebarContext.Provider value={{ isExpanded, toggle: () => setIsExpanded((v) => !v) }}>
      {children}
    </SidebarContext.Provider>
  );
}
