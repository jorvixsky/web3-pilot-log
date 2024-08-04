import { easBaseSepolia, easOptimismSepolia } from "@/lib/eas";
import { EAS } from "@ethereum-attestation-service/eas-sdk";
import { optimismSepolia, baseSepolia } from "viem/chains";
import { useChainId } from "wagmi";

export default function useEAS(): EAS | undefined {
  const chainId = useChainId();

  switch (chainId) {
    case optimismSepolia.id:
      return easOptimismSepolia;
    case baseSepolia.id:
      return easBaseSepolia;
    default:
      return undefined;
  }
}
