"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type MenuContextType = {
  open: boolean;
  /** incrementa a cada abertura — usado para re-disparar o scramble */
  seq: number;
  openMenu: () => void;
  closeMenu: () => void;
};

const MenuContext = createContext<MenuContextType>({
  open: false,
  seq: 0,
  openMenu: () => {},
  closeMenu: () => {},
});

/** largura do painel = quanto o site desliza pra esquerda. Mantido em sincronia com PageShell. */
export const MENU_WIDTH = "min(400px, 82vw)";

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [seq, setSeq] = useState(0);
  const openMenu = useCallback(() => {
    setOpen(true);
    setSeq((s) => s + 1);
  }, []);
  const closeMenu = useCallback(() => setOpen(false), []);
  return (
    <MenuContext.Provider value={{ open, seq, openMenu, closeMenu }}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}
