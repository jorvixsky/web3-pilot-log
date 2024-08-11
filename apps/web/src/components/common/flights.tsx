import { ColumnDef } from "@tanstack/react-table";
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
    accessorKey: "departure.time",
    header: "Departure Time",
  },
  {
    accessorKey: "arrival.place",
    header: "Arrival",
  },
  {
    accessorKey: "arrival.time",
    header: "Arrival Time",
  },
  {
    accessorKey: "aircraft.model",
    header: "Aircraft",
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
