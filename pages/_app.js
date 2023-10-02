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

const starknet = {
  id: 43_114,
  name: 'Avalanche',
  network: 'avalanche',
  iconUrl: 'https://example.com/icon.svg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: 'Avalanche',
    symbol: 'AVAX',
  },
  rpcUrls: {
    public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
    default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
  },
  blockExplorers: {
    default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
    etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 11_907_934,
    },
  },
  testnet: false,
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    bsc,
    polygon,
    optimism,
    arbitrum,
    base,
    zora,
    { ...zkSync, iconUrl: "/assets/zksync.png" },
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
              <Component {...pageProps} />
            </SnackbarProvider>{" "}
          </RainbowKitProvider>
        </WagmiConfig>
      </ThemeProvider>
    </Provider>
  );
}
