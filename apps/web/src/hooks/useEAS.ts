import { easBaseSepolia, easOptimismSepolia } from "@/lib/eas";
import { useChainId } from "wagmi";

export default function useEAS() {
  const chainId = useChainId();

  switch (chainId) {
    case 1:
      return easOptimismSepolia;
    case 84532:
      return easBaseSepolia;
    default:
      throw new Error(`Unsupported chainId: ${chainId}`);
  }
}
