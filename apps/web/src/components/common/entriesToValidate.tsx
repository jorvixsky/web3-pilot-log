import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import ValidateEntryPopup from "./validateEntryPopup";
import { ValidationResponse } from "@/lib/structs";

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
  
  function showEntryToValidate(rowIndex: number){
    setContractData(data.data[rowIndex])
  }

  function closePopup(){
    setContractData(undefined);
  }

  return (
    <div >
      <DataTable columns={columns} data={data as any} onRowClicked={showEntryToValidate}/>
      <ValidateEntryPopup contractData={contractData} onClosePopup={() => closePopup()} data={undefined}/>
    </div>
  );
}
