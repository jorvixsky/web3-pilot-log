import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/ui/data-table";
import { useState } from "react";
import FlightPopup from "./flightPopup";

const columns: ColumnDef<any>[] = [
  {
    accessorKey: "date",
    header: "Date",
  },
  {
    accessorKey: "departure.place",
    header: "Departure",
  },
  {
    accessorKey: "arrival.place",
    header: "Arrival",
  },
  {
    accessorKey: "aircraft.model",
    header: "Aircraft",
  },
  {
    accessorKey: "pics",
    header: "Pics",
  },
  {
    accessorKey: "seeMore",
    header: "See more"
  }
];

export default function FlightsTable(data: any) {
  const [popupInfo, setPopupInfo] = useState<any>(undefined);

  function showPopupForFlightAtIndex(rowIndex: number){
    setPopupInfo(data.data[rowIndex])
  }
  return (
    <div >
      <DataTable columns={columns} data={data.data} onRowClicked={showPopupForFlightAtIndex}/>
      <FlightPopup data={popupInfo} onClosePopup={()=>setPopupInfo(undefined)}/>
    </div>
  );
}
