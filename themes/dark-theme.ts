import { createTheme } from "@mui/material/styles";

export const darkTheme = createTheme({
  palette: {
    mode: "dark", // Modo oscuro activado
    primary: {
      main: "#fff", // Un color más claro para un mejor contraste en el fondo oscuro
    },
    secondary: {
      main: "#90caf9", // De nuevo, un color más claro
    },
    info: {
      main: "#64b5f6", // Un color más claro
    },
  },
  components: {
    MuiLink: {
      defaultProps: {
        underline: "none",
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        position: "fixed",
      },
      styleOverrides: {
        root: {
          backgroundColor: "black", // Barra de aplicaciones oscura
          height: 60,
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: 30,
          fontWeight: 600,
        },
        h2: {
          fontSize: 20,
          fontWeight: 400,
        },
        subtitle1: {
          fontSize: 18,
          fontWeight: 600,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        size: "small",
        disableElevation: true,
        color: "info",
      },
      styleOverrides: {
        root: {
          color: "white",
          textTransform: "none",
          boxShadow: "none",
          borderRadius: 10,
          backgroundColor: "rgba(0,0,0,0.1)",
          ":hover": {
            backgroundColor: "rgba(255,255,255,0.2)", // Un color más oscuro para el hover
            transition: "all 0.3s ease-in-out",
          },
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: "0px 5px 5px rgba(255,255,255,0.1)", // Un sombreado más claro
          borderRadius: "10px",
        },
      },
    },
  },
});
