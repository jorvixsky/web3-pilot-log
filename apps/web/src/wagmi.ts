import { http, createConfig } from "wagmi";
import { baseSepolia, optimismSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [optimismSepolia, baseSepolia],
  transports: {
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
