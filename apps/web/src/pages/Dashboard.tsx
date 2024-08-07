import Header from "@/components/common/header";
import NewLicense from "@/components/common/license";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function Dashboard() {
  const [isLicenseConfigured, setIsLicenseConfigured] = useState(true);

  const { isConnected } = useAccount();

  // TODO: Add reading contract to load the license, if it does not exist, proceed to create it

  useEffect(() => {
    if (!isConnected) {
      window.location.href = "/";
    }
  }, [isConnected]);

  useEffect(() => {
    const licenseIPFS = localStorage.getItem("licenseIPFS");
    licenseIPFS ? setIsLicenseConfigured(true) : setIsLicenseConfigured(false);
  }, []);

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
