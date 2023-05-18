import { UiState } from "./UiProvider";

type UiActionType = { type: "[UI] - ToggleMenu" | "[UI] - ToggleTheme" };

export const uiReducer = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case "[UI] - ToggleMenu":
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };
    case "[UI] - ToggleTheme": // nuevo case
      return {
        ...state,
        isDarkTheme: !state.isDarkTheme,
      };
    default:
      return {
        ...state,
      };
  }
};
