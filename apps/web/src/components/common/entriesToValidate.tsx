import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ValidateEntryPopup from "./validateEntryPopup";
import { ValidationResponse } from "@/lib/structs";
import axios from "axios";
import {
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import { flightsSchema } from "@/lib/eas";
import { useEthersProvider, useEthersSigner } from "@/lib/ethers";
import { useAccount, useWriteContract } from "wagmi";
import pilotLog from "../../../contracts.json";
import useSelectContract from "@/hooks/useSelectContract";
import useEAS from "@/hooks/useEAS";
import lighthouse from "@lighthouse-web3/sdk";
import { flightsSchemaEncoder } from "@/lib/eas";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "logbookOwner",
    header: "Pilot",
  },
  {
    accessorKey: "entryCid",
    header: "IPFS cid"
  },
  {
    accessorKey: "isValidated",
    header: "Is Validated",
  },
  {
    accessorKey: "seeMore",
    header: "See more"
  }
];

interface EntriesToValidateProps {
  data: ValidationResponse[];
  closedData: ValidationResponse[];
}

export default function EntriesToValidate(data: EntriesToValidateProps) {
  const [contractData, setContractData] = useState<ValidationResponse|undefined>(undefined);
  const [entryCid, setEntryCid] = useState<string|undefined>(undefined);
  const [currentEntry, setCurrentEntry] = useState<any[]>([]);
  const [decodedEntry, setDecodedEntry] = useState<any>();
  const provider = useEthersProvider();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number|undefined>(undefined);
  const [selectedClosedRowIndex, setSelectedClosedRowIndex] = useState<number|undefined>(undefined);
  const contract = useSelectContract();
  const [isLoading, setIsLoading] = useState(false);
  const [showValidateButton, setShowValidateButton] = useState(false);
  
  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );
  // @ts-expect-error: provider is not properly typed
  schemaRegistry.connect(provider);
  const { writeContractAsync } = useWriteContract();

  useEffect(()=> {
    if(selectedRowIndex == undefined && selectedClosedRowIndex == undefined){
      setEntryCid(undefined);
      setContractData(undefined);
    }
    else if(selectedRowIndex != undefined){
      setEntryCid(data.data[selectedRowIndex].entryCid);
      setContractData(data.data[selectedRowIndex])
    }
  }, [selectedRowIndex]);
  useEffect(()=> {
    if(selectedClosedRowIndex == undefined && selectedRowIndex == undefined){
      setEntryCid(undefined);
      setContractData(undefined);
    }
    else if(selectedClosedRowIndex != undefined){
      setEntryCid(data.closedData[selectedClosedRowIndex].entryCid);
      setContractData(data.closedData[selectedClosedRowIndex])
    }
  }, [selectedClosedRowIndex])

  useEffect(() => {
    if (entryCid) {
      async function getEntry() {
        const response = await axios.get(
          `https://gateway.lighthouse.storage/ipfs/${entryCid}`
        );
        const logbook : any[] = response.data.data;
        setCurrentEntry(logbook);
      }
      getEntry();
    }
  }, [entryCid]);


  useEffect(() => {
    async function getSchema() {
      if (!currentEntry || currentEntry.length < 1) return;
      const schema = await schemaRegistry.getSchema({ uid: flightsSchema });
      const schemaEncoder = new SchemaEncoder(schema.schema);
      const decodedData = currentEntry.map((logbook: any) => {
        const data = schemaEncoder.decodeData(logbook.message.data);
        // @ts-expect-error: data is not properly typed
        return JSON.parse(data[0].value.value);
      });
      setDecodedEntry(decodedData[0]);
    }
    getSchema();
  }, [currentEntry]);

  function closePopup(){
    console.log(closePopup)
    setContractData(undefined);
    setDecodedEntry(undefined);
  }

  const eas = useEAS();
  const signer = useEthersSigner();
  const { address } = useAccount();

  if (eas && signer) {
    eas.connect(signer);
  }

 async function uploadToLighthouse(): Promise<string> {
  if (!eas) {
    throw new Error("EAS not connected");
  }
  const validatedFlightData = [
    { name: "flightData", value: JSON.stringify(decodedEntry), type: "string" },
    { name: "signer", value: address as string, type: "address" },
  ];
  const encodedFlightData = flightsSchemaEncoder.encodeData(validatedFlightData);
  const offchain = await eas.getOffchain();
  const offchainAttestation = await offchain.signOffchainAttestation(
    {
      expirationTime: 0n,
      revocable: false,
      time: BigInt(Math.round(Date.now() / 1000)),
      schema:
        "0x35a8a3ebd9ec1aed4494fa8905233b100e79ce22a238d0589fdab41763e4ea68",
      data: encodedFlightData,
      refUID:
        "0x0000000000000000000000000000000000000000000000000000000000000000",
      recipient:
          address as string,
    },
    // @ts-expect-error: signer is not properly typed
    signer
  );

  const stringifiedOffchainAttestation = JSON.stringify(
    {
      data: [
        {
          ...offchainAttestation,
          expirationTime: Number(offchainAttestation.message.expirationTime),
          time: Number(offchainAttestation.message.time),
        }
      ],
    },
    // @ts-ignore: key not being used
    (key, value) => {
      return typeof value === "bigint" ? Number(value) : value;
    }
  );

  console.log(stringifiedOffchainAttestation);

    const response = await lighthouse.uploadText(
      stringifiedOffchainAttestation,
      sessionStorage.getItem("lighthouseApiKey") ?? "" // TODO: add file name?
    );
    const flightIPFS = response.data.Hash;
    return flightIPFS;
 }

  async function validateEntry(){
    // TODO: do all the logic for entry validation
    setIsLoading(true);
    
    try {
      const ipfsId = await uploadToLighthouse();

      console.log("ipfsid", ipfsId)
      await writeContractAsync({
        address: contract,
        abi: pilotLog[0].abi,
        functionName: "validateEntry",
        args: [contractData?.logbookOwner, contractData?.logbookId, contractData?.entryCid],
      });
    } finally{
      console.log("validate close popup")
      setIsLoading(false);
      console.log("close popup from validate entry")
      closePopup();
    }
  }



  return (
    <div >
      <h1 className="text-2xl font-extrabold dark:text-white mt-24">Need validation</h1>
      <DataTable columns={columns} data={data.data ?? []} onRowClicked={(row)=>{setSelectedRowIndex(row); setShowValidateButton(true)}}/>
      <h1 className="text-2xl font-extrabold dark:text-white mt-24">Validated</h1>
      <DataTable columns={columns} data={data.closedData ?? []} onRowClicked={(row)=>{setSelectedClosedRowIndex(row); setShowValidateButton(false)}}/>
      <ValidateEntryPopup isLoading={isLoading} contractData={contractData} onClosePopup={() => closePopup()} data={decodedEntry} onValidateEntry={validateEntry} showValidateButton={showValidateButton}/>
    </div>
  );
}
