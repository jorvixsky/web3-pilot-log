import { z } from "zod";
import { ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { flightSchema } from "@/lib/schemas";
import { DataTable } from "@/components/ui/data-table";

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
];

export default function FlightsTable(data: any) {
  return (
    <div>
      <DataTable columns={columns} data={data.data} />
    </div>
  );
}
