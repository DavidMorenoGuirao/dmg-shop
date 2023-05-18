import "../styles/globals.css";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { lightTheme, darkTheme } from "./../themes";
import { SWRConfig } from "swr";
import UiProvider from "../context/ui/UiProvider";
import CartProvider from "../context/cart/CartProvider";
import { AuthProvider } from "../context/auth/AuthProvider";
import { SessionProvider } from "next-auth/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useContext } from "react";
import { UiContext } from "../context/ui/UiContext";

function ThemeComponent({ children }: { children: React.ReactNode }) {
  const { isDarkTheme } = useContext(UiContext);
  return (
    <ThemeProvider theme={isDarkTheme ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const { isDarkTheme } = useContext(UiContext);
  console.log(isDarkTheme);
  return (
    <SessionProvider session={session}>
      <PayPalScriptProvider
        options={{
          "client-id": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
        }}
      >
        <SWRConfig
          value={{
            fetcher: (resource, init) =>
              fetch(resource, init).then((res) => res.json()),
          }}
        >
          <AuthProvider>
            <CartProvider>
              <UiProvider>
                <ThemeComponent>
                  <Component {...pageProps} />
                </ThemeComponent>
              </UiProvider>
            </CartProvider>
          </AuthProvider>
        </SWRConfig>
      </PayPalScriptProvider>
    </SessionProvider>
  );
}
