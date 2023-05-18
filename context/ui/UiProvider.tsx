import { FC, useReducer, PropsWithChildren } from "react";
import { UiContext } from "./UiContext";
import { uiReducer } from "./uiReducer";

export interface UiState {
  isMenuOpen: boolean;
  isDarkTheme: boolean; // nuevo estado
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
  isDarkTheme: false,
};

const UiProvider: FC<PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toggleTheme = () => {
    dispatch({ type: "[UI] - ToggleTheme" });
  };

  const toggleSideMenu = () => {
    dispatch({ type: "[UI] - ToggleMenu" });
  };

  return (
    <UiContext.Provider value={{ ...state, toggleSideMenu, toggleTheme }}>
      {children}
    </UiContext.Provider>
  );
};

export default UiProvider;
