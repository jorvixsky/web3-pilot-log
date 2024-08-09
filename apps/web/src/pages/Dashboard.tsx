import Header from "@/components/common/header";
import NewLicense from "@/components/common/license";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import pilotLog from "../../contracts.json";

interface getUserProfileResponse {
  profileCid: string;
  userType: number;
}

export default function Dashboard() {
  const [isLicenseConfigured, setIsLicenseConfigured] = useState(true);

  const { isConnected, address } = useAccount();

  // TODO: Add error handling

  const result = useReadContract({
    address: pilotLog[0].address as `0x${string}`,
    abi: pilotLog[0].abi,
    functionName: "getUserProfile",
    args: [address],
  }).data as getUserProfileResponse;

  useEffect(() => {
    setIsLicenseConfigured(result && result.profileCid ? true : false);
  }, [result]);

  useEffect(() => {
    if (!isConnected) {
      window.location.href = "/";
    }
  }, [isConnected]);

  return (
    <div>
      <Header />
      <div className="flex flex-col gap-4 mx-auto justify-center items-center mt-8 mb-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        {!isLicenseConfigured && <NewLicense />}
      </div>
    </div>
  );
}
