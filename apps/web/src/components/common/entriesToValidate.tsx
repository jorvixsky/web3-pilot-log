import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import ValidateEntryPopup from "./validateEntryPopup";
import { ValidationResponse } from "@/lib/structs";
import axios from "axios";

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
  const [currentEntry, setCurrentEntry] = useState<any>();
  
  useEffect(() => {
    if (entryCid) {
      async function getEntry() {
        const response = await axios.get(
          `https://gateway.lighthouse.storage/ipfs/${entryCid}`
        );
        const logbook : any[] = response.data.data;
        setCurrentEntry(logbook[0]);
      }
      getEntry();
    }
  }, [entryCid]);


  function showEntryToValidate(rowIndex: number){
    setEntryCid(data.data[rowIndex].entryCid);
    setContractData(data.data[rowIndex])
  }

  function closePopup(){
    setContractData(undefined);
  }

  console.log(data)
  return (
    <div >
      <DataTable columns={columns} data={data.data as any} onRowClicked={showEntryToValidate}/>
      <ValidateEntryPopup contractData={contractData} onClosePopup={() => closePopup()} data={currentEntry}/>
    </div>
  );
}
