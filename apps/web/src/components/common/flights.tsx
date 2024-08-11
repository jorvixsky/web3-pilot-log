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
    accessorKey: "departure.time",
    header: "Departure Time",
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
    accessorKey: "totalTimeOfFlight.hours",
    header: "Total Time of Flight",
  },
  {
    accessorKey: "numberOfLandings.day",
    header: "Number of Landings",
  },
  {
    accessorKey: "numberOfLandings.night",
    header: "Number of Landings",
  },
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    accessorKey: "selfSigned",
    header: "Self Signed",
  },
  {
    accessorKey: "signedBy",
    header: "Signed By",
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
