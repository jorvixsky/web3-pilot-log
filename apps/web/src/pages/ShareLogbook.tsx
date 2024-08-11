import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useWriteContract } from "wagmi";
import pilotLog from "../../contracts.json";

export default function ShareLogbookPage() {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const { writeContractAsync } = useWriteContract();

  const handleShare = async () => {
    setIsLoading(true);
    await writeContractAsync({
      address: pilotLog[0].address as `0x${string}`,
      abi: pilotLog[0].abi,
      functionName: "giveLogbookPermission",
      args: [address],
    });
    setIsLoading(false);
  };

  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 justify-center items-center mx-auto sm:max-w-sm max-w-xl mt-4">
        <h1 className="text-2xl font-bold">Share my logbook</h1>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
          disabled={loading}
        />
        <Button disabled={loading} onClick={handleShare}>
          Share
        </Button>
      </div>
    </>
  );
}
