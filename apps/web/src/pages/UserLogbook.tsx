import useSelectContract from "@/hooks/useSelectContract";
import { flightsSchema } from "@/lib/eas";
import { useEthersProvider } from "@/lib/ethers";
import {
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAccount } from "wagmi";
import { useReadContract } from "wagmi";
import pilotLog from "../../contracts.json";
import Header from "@/components/common/header";
import FlightsTable from "@/components/common/flights";

export default function UserLogbookPage() {
  const [currentLogbook, setCurrentLogbook] = useState<any[]>([]);
  const [decodedLogbook, setDecodedLogbook] = useState<any[]>([]);
  const provider = useEthersProvider();
  const contract = useSelectContract();
  const { address } = useAccount();
  const [searchParams] = useSearchParams();

  const pilotAddress = searchParams.get("pilotAddress");

  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );
  // @ts-expect-error: provider is not properly typed
  schemaRegistry.connect(provider);

  const { data: logbook } = useReadContract({
    address: contract,
    abi: pilotLog[0].abi,
    functionName: "getLogbooks",
    args: [pilotAddress],
    account: address,
  });

  useEffect(() => {
    // @ts-expect-error: logbook is not properly typed
    if (logbook && logbook.openBook.lastEntryCid) {
      async function getLogbook() {
        const response = await axios.get(
          // @ts-expect-error: logbook is not properly typed
          `https://gateway.lighthouse.storage/ipfs/${logbook.openBook.lastEntryCid}`
        );
        setCurrentLogbook(response.data.data);
      }
      getLogbook();
    }
  }, [logbook]);

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

  return (
    <>
      <Header />
      <div className="flex flex-col gap-3 items-center justify-center mx-auto mt-2">
        <h1 className="text-4xl font-bold">Logbook</h1>
        <p>
          <span className="font-bold">This is the logbook for the pilot:</span>{" "}
          {pilotAddress}
        </p>
        {decodedLogbook && <FlightsTable data={decodedLogbook} />}
      </div>
    </>
  );
}
