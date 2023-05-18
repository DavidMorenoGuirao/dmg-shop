import { createContext } from "react";

interface ContextProps {
  isMenuOpen: boolean;
  toggleSideMenu: () => void;
  isDarkTheme: boolean; // Nuevo estado
  toggleTheme: () => void; // Nueva función
}

export const UiContext = createContext({} as ContextProps);
