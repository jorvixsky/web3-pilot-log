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
import { useEthersProvider } from "@/lib/ethers";

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
}

export default function EntriesToValidate(data: EntriesToValidateProps) {
  const [contractData, setContractData] = useState<any>(undefined);
  const [entryCid, setEntryCid] = useState<string|undefined>(undefined);
  const [currentEntry, setCurrentEntry] = useState<any[]>([]);
  const [decodedEntry, setDecodedEntry] = useState<any>();
  const provider = useEthersProvider();
  
  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );
  // @ts-expect-error: provider is not properly typed
  schemaRegistry.connect(provider);

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
      setDecodedEntry(undefined);
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

  function showEntryToValidate(rowIndex: number){
    setEntryCid(data.data[rowIndex].entryCid);
    setContractData(data.data[rowIndex])
  }

  function closePopup(){
    setContractData(undefined);
    setDecodedEntry(undefined);
  }

  return (
    <div >
      <DataTable columns={columns} data={data.data ?? []} onRowClicked={showEntryToValidate}/>
      <ValidateEntryPopup contractData={contractData} onClosePopup={() => closePopup()} data={decodedEntry}/>
    </div>
  );
}
