import Header from "@/components/common/header";
import NewLicense from "@/components/common/license";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
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
import FlightsTable from "@/components/common/flights";
import useSelectContract from "@/hooks/useSelectContract";
import { UserType } from "@/lib/enums";

interface getUserProfileResponse {
  profileCid: string;
  userType: UserType;
}

export default function Dashboard() {
  const [isProfileConfigured, setIsProfileConfigured] = useState(true);
  const [userType, setUserType] = useState<UserType | undefined>(undefined);
  const [currentLogbook, setCurrentLogbook] = useState<any[]>([]);
  const [decodedLogbook, setDecodedLogbook] = useState<any[]>([]);
  const provider = useEthersProvider();
  const contract = useSelectContract();
  const { isConnected, address } = useAccount();
  const [searchParams, setSearchParams] = useSearchParams();

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
        setCurrentLogbook(response.data.data);
      }
      getLogbook();
    }
  }, [logbookCid]);

  useEffect(() => {
    async function getSchema() {
      if (!currentLogbook || currentLogbook.length < 1) return;
      setDecodedLogbook([]);
      const schema = await schemaRegistry.getSchema({ uid: flightsSchema });
      const schemaEncoder = new SchemaEncoder(schema.schema);
      const decodedData = currentLogbook.map((logbook: any) => {
        const data = schemaEncoder.decodeData(logbook.message.data);
        // @ts-expect-error: data is not properly typed
        return JSON.parse(data[0].value.value);
      });
      setDecodedLogbook(decodedData);
    }
    getSchema();
  }, [currentLogbook]);

  // TODO: Add error handling

  const result = useReadContract({
    address: contract,
    abi: pilotLog[0].abi,
    functionName: "getUserProfile",
    args: [address],
  }).data as getUserProfileResponse;

  const logbookData = useReadContract({
    address: contract,
    abi: pilotLog[0].abi,
    functionName: "getLogbooks",
    args: [address],
    account: address,
  }).data as any;

  useEffect(() => {
    if (logbookData) {
      setSearchParams({ flightIPFS: logbookData.openBook.lastEntryCid });
    }
  }, [logbookData]);

  useEffect(() => {
    setIsProfileConfigured(result && result.profileCid ? true : false);
    if (result) {
      setUserType(result.userType);
    }
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
        {!isProfileConfigured && <NewLicense />}
        {isProfileConfigured && userType === UserType.PILOT && (
          <>
            <div className="flex gap-4 justify-center items-center ">
              <Link to="/new-flight">
                <Button>Create new flight</Button>
              </Link>
              <Link to="/share-logbook">
                <Button variant="outline">Share my logbook</Button>
              </Link>
            </div>
            <div className="mx-auto">
              <FlightsTable data={decodedLogbook} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
