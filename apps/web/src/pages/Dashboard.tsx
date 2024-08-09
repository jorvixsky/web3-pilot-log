import Header from "@/components/common/header";
import NewLicense from "@/components/common/license";
import { useEffect, useState } from "react";
import { useAccount, useChainId } from "wagmi";
import { useReadContract } from "wagmi";
import pilotLog from "../../contracts.json";
import { Button } from "@/components/ui/button";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import {
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { flightsSchema } from "@/lib/eas";
import { useEthersProvider } from "@/lib/ethers";
import Flights from "@/components/common/flights";
import FlightsTable from "@/components/common/flights";

interface getUserProfileResponse {
  profileCid: string;
  userType: number;
}

export default function Dashboard() {
  const [isLicenseConfigured, setIsLicenseConfigured] = useState(true);
  const [currentLogbook, setCurrentLogbook] = useState<any[]>([]);
  const [decodedLogbook, setDecodedLogbook] = useState<any[]>([]);
  const provider = useEthersProvider();
  const { isConnected, address } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();
  const chain = useChainId();

  const logbookCid = searchParams.get("flightIPFS");

  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );
  // @ts-expect-error: provider is not properly typed
  schemaRegistry.connect(provider);

  useEffect(() => {
    if (logbookCid) {
      async function getLogbook() {
        const response = await axios.get(
          `https://gateway.lighthouse.storage/ipfs/${logbookCid}`
        );
        console.log(response.data);
        setCurrentLogbook(response.data);
      }
      getLogbook();
    }
  }, [logbookCid]);

  console.log(currentLogbook);

  useEffect(() => {
    if (!currentLogbook.length) return;
    async function getSchema() {
      const schema = await schemaRegistry.getSchema({ uid: flightsSchema });
      const schemaEncoder = new SchemaEncoder(schema.schema);
      const data = schemaEncoder.decodeData(currentLogbook.message.data);
      console.log(JSON.parse(data[0].value.value));
      setDecodedLogbook(JSON.parse(data[0].value.value));
    }
    getSchema();
  }, [currentLogbook]);

  // TODO: Add error handling

  const result = useReadContract({
    address: pilotLog[0].address as `0x${string}`,
    abi: pilotLog[0].abi,
    functionName: "getUserProfile",
    args: [address],
  }).data as getUserProfileResponse;

  const logbookData = useReadContract({
    address: pilotLog[0].address as `0x${string}`,
    abi: pilotLog[0].abi,
    functionName: "getLogbooks",
    args: [address],
    account: address,
  }).data as any;

  useEffect(() => {
    if (logbookData) {
      setSearchParams({ flightIPFS: logbookData.openBook.id });
    }
  }, [logbookData]);

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
          </div>
        )}
        <div className="mx-auto">
          <FlightsTable data={decodedLogbook} />
        </div>
      </div>
    </div>
  );
}
