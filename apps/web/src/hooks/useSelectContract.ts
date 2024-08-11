import { useAccount } from "wagmi";
import pilotLogbook from "../../contracts.json";

export default function useSelectContract(): `0x${string}` {
  const { chainId } = useAccount();

  switch (chainId) {
    case 11155420:
      return pilotLogbook[0].addresses.optimismSepolia as `0x${string}`;
    case 84532:
      return pilotLogbook[0].addresses.baseSepolia as `0x${string}`;
    default:
      return pilotLogbook[0].addresses.optimismSepolia as `0x${string}`;
  }
}
