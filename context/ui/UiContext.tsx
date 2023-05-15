
import { createContext } from 'react';

interface ContextProps{
    isMenuOpen: boolean;

    //Methods
    toggleSidebar: () => void;
}


export const UiContext = createContext({} as ContextProps);