import { easBaseSepolia, easOptimismSepolia } from "@/lib/eas";
import { optimismSepolia, baseSepolia } from "viem/chains";
import { useChainId } from "wagmi";

export default function useEAS() {
  const chainId = useChainId();

  switch (chainId) {
    case optimismSepolia.id:
      return easOptimismSepolia;
    case baseSepolia.id:
      return easBaseSepolia;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
