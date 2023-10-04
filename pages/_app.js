import "@/styles/globals.scss";
import "react-slideshow-image/dist/styles.css";
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { SnackbarProvider } from "notistack";
import store from "../redux/store";
import { theme } from "../styles/theme";
import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import {
  arbitrum,
  goerli,
  mainnet,
  optimism,
  polygon,
  base,
  bsc,
  zkSync,
  zora,
  celo,
  mantle,
  taikoJolnir,
} from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import React from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../utils/i18n.js"; // Import your i18n configuration file

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    { ...zkSync, iconUrl: "/assets/zksync.png" },
    zora,
    { ...celo, iconUrl: "/assets/celo.png" },
    { ...mantle, iconUrl: "/assets/mantel.png" },
    { ...taikoJolnir, iconUrl: "/assets/taiko.png" },
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === "true" ? [goerli] : []),
  ],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "wildbaseSwap",
  projectId: "38d800849c526806bd234fc5553d8c64",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <WagmiConfig config={wagmiConfig}>
          <RainbowKitProvider
            chains={chains}
            theme={darkTheme({
              accentColor: "#202946",
              accentColorForeground: "white",
              borderRadius: "medium",
              overlayBlur: "small",
            })}
          >
            <SnackbarProvider maxSnack={3}>
              <I18nextProvider i18n={i18n}>
                <Component {...pageProps} />
              </I18nextProvider>
            </SnackbarProvider>
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </Provider>
  );
}
