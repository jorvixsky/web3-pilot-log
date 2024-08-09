import Header from "@/components/common/header";
import NewLicense from "@/components/common/license";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import pilotLog from "../../contracts.json";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
        {isLicenseConfigured && (
          <div className="flex flex-col gap-4 justify-center items-center ">
            <Link to="/new-flight">
              <Button>Create new flight</Button>
            </Link>
            <Link to="/logbook">
              <Button>Logbook</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
