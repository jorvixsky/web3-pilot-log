import { http, createConfig } from "wagmi";
import { hardhat, baseSepolia, optimismSepolia } from "wagmi/chains";

export const wagmiConfig = createConfig({
  chains: [hardhat, optimismSepolia, baseSepolia],
  transports: {
    [hardhat.id]: http(),
    [optimismSepolia.id]: http(),
    [baseSepolia.id]: http(),
  },
});
