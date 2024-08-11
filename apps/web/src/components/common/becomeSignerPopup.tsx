import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useWriteContract } from "wagmi";
import useSelectContract from "@/hooks/useSelectContract";
import pilotLogbook from "../../../contracts.json";
import { useNavigate } from "react-router-dom";

export default function BecomeSignerPopup() {
  const contract = useSelectContract();
  const { writeContract } = useWriteContract();
  const navigate = useNavigate();

  function becomeSigner() {
    writeContract({
      address: contract,
      abi: pilotLogbook[0].abi,
      functionName: "promoteToSigner",
    });
    navigate("/");
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Become a signer</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Become a signer</DialogTitle>
          <DialogDescription>
            By becoming a signer, you will be able to sign flights on other
            pilot's logbooks when they require you to do so.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button type="submit" onClick={becomeSigner}>
            Become a signer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
