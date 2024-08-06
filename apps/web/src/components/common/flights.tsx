import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

export default function Flights() {
  return (
    <Table>
      <TableHeader className="text-center">
        <TableRow>
          <TableCell className="border border-gray-300"></TableCell>
          <TableCell colSpan={2} className="border border-gray-300">
            Departure
          </TableCell>
          <TableCell colSpan={2} className="border border-gray-300">
            Arrival
          </TableCell>
          <TableCell colSpan={2} className="border border-gray-300">
            Aircraft
          </TableCell>
          <TableCell className="border border-gray-300"></TableCell>
          <TableCell colSpan={2} className="border border-gray-300">
            Single Pilot Time
          </TableCell>
          <TableCell colSpan={2} className="border border-gray-300"></TableCell>
          <TableCell colSpan={2} className="border border-gray-300"></TableCell>
          <TableCell colSpan={2} className="border border-gray-300">
            No. Ldg.
          </TableCell>
          <TableCell colSpan={7} className="border border-gray-300">
            Conditions of flight
          </TableCell>
          <TableCell colSpan={8} className="border border-gray-300">
            Pilot function time
          </TableCell>
          <TableCell colSpan={4} className="border border-gray-300">
            FSTD Session
          </TableCell>
          <TableCell colSpan={2} className="border border-gray-300"></TableCell>
        </TableRow>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>Time</TableHead>
          <TableHead>Place</TableHead>
          <TableHead>Make, model, variant</TableHead>
          <TableHead>Registration</TableHead>
          <TableHead>Name(s) PIC</TableHead>
          <TableHead>SE</TableHead>
          <TableHead>ME</TableHead>
          <TableHead colSpan={2}>Multi Pilot Time</TableHead>
          <TableHead colSpan={2}>Total time of flight</TableHead>
          <TableHead>Day</TableHead>
          <TableHead>Night</TableHead>
          <TableHead colSpan={2}>Night</TableHead>
          <TableHead colSpan={2}>IFR Hood</TableHead>
          <TableHead colSpan={2}>IFR Actual</TableHead>
          <TableHead>Flight rules</TableHead>
          <TableHead colSpan={2}>PIC</TableHead>
          <TableHead colSpan={2}>Co-pilot</TableHead>
          <TableHead colSpan={2}>Dual</TableHead>
          <TableHead colSpan={2}>FI</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead colSpan={2}>Total time of session</TableHead>
          <TableHead>Remarks and endorsements</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="text-center">
        <TableRow>
          <TableCell>30/12/24</TableCell>
          <TableCell>10:30</TableCell>
          <TableCell>LELL</TableCell>
          <TableCell>11:30</TableCell>
          <TableCell>LELL</TableCell>
          <TableCell>C150</TableCell>
          <TableCell>A-12345</TableCell>
          <TableCell>SELF</TableCell>
          <TableCell>X</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>1</TableCell>
          <TableCell>00</TableCell>
          <TableCell>1</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>1</TableCell>
          <TableCell>00</TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell></TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
