import useSelectContract from "@/hooks/useSelectContract";
import { useAccount, useReadContract } from "wagmi";
import pilotLog from "../../../contracts.json";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface AllowedProfile {
  profileCid: string;
  userType: number;
  userAddr: `0x${string}`;
}

export default function AllowedProfiles() {
  const contract = useSelectContract();
  const { address } = useAccount();
  const [allowedProfiles, setAllowedProfiles] = useState<AllowedProfile[]>([]);

  const { data } = useReadContract({
    address: contract,
    abi: pilotLog[0].abi,
    functionName: "getAllowedPilotProfiles",
    account: address,
  });

  useEffect(() => {
    if (data) {
      setAllowedProfiles(data as AllowedProfile[]);
    }
  }, [data]);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-bold">Pilot Profiles</h2>
      <p className="text-sm text-gray-500">
        Here you can see all the licenses and logbooks for the pilots that
        allowed your entity to access their data.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User Address</TableHead>
            <TableHead>License</TableHead>
            <TableHead>Logbook</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allowedProfiles?.map((profile: AllowedProfile) => (
            <TableRow key={profile.profileCid}>
              <TableCell>{profile.userAddr}</TableCell>
              <TableCell>
                <Link
                  to={`/license?cid=${profile.profileCid}&pilotAddress=${profile.userAddr}`}
                >
                  <Button className="self-center" variant="outline">
                    View
                  </Button>
                </Link>
              </TableCell>
              <TableCell>
                <Link to={`/logbook?pilotAddress=${profile.userAddr}`}>
                  <Button className="self-center">View</Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
