import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "../ui/form";
import { flightSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { cn, stringifyAttestation } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "../ui/checkbox";
import { useEffect, useState } from "react";
import lighthouse from "@lighthouse-web3/sdk";
import { flightsSchemaEncoder } from "@/lib/eas";
import useEAS from "@/hooks/useEAS";
import { useEthersSigner } from "@/lib/ethers";
import { useAccount, useReadContract } from "wagmi";
import pilotLog from "../../../contracts.json";
import axios from "axios";
import { useWriteContract } from "wagmi";
import { useNavigate } from "react-router-dom";

export default function NewFlight() {
  const [isLoading, setIsLoading] = useState(false);
  const [selfSigned, setSelfSigned] = useState(true);
  const [isSinglePilotTime, setIsSinglePilotTime] = useState(true);
  const navigate = useNavigate();

  const { writeContractAsync } = useWriteContract();
  const eas = useEAS();
  const signer = useEthersSigner();

  const { address } = useAccount();

  if (eas && signer) {
    eas.connect(signer);
  }

  const { data: logbookCid } = useReadContract({
    address: pilotLog[0].address as `0x${string}`,
    abi: pilotLog[0].abi,
    functionName: "getLogbooks",
    args: [address],
  });

  useEffect(() => {
    if (!logbookCid) return;
    async function getLogbook() {
      const response = await axios.get(
        `https://gateway.lighthouse.storage/ipfs/${logbookCid}`
      );
      console.log(response.data);
    }
    getLogbook();
  }, [logbookCid]);

  async function onSubmit(values: z.infer<typeof flightSchema>) {
    console.log(values);
    setIsLoading(true);
    if (!eas) {
      throw new Error("EAS not connected");
    }
    if (selfSigned) {
      values.signedBy = address as string;
    }

    // TODO: store flight in logbook if there is logbook
    const flightData = [
      { name: "flightData", value: JSON.stringify(values), type: "string" },
      { name: "signer", value: values.signedBy, type: "address" },
    ];

    const encodedFlightData = flightsSchemaEncoder.encodeData(flightData);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        expirationTime: 0n,
        revocable: false,
        time: BigInt(Math.round(Date.now() / 1000)),
        schema:
          "0x35a8a3ebd9ec1aed4494fa8905233b100e79ce22a238d0589fdab41763e4ea68",
        data: encodedFlightData,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        recipient:
          values.signedBy === address
            ? "0x0000000000000000000000000000000000000000"
            : values.signedBy,
      },
      // @ts-expect-error: signer is not properly typed
      signer
    );

    const stringifiedOffchainAttestation =
      stringifyAttestation(offchainAttestation);

    const response = await lighthouse.uploadText(
      stringifiedOffchainAttestation,
      sessionStorage.getItem("lighthouseApiKey") ?? "" // TODO: add file name?
    );

    const flightIPFS = response.data.hash;

    console.log(flightIPFS);

    await writeContractAsync({
      address: pilotLog[0].address as `0x${string}`,
      abi: pilotLog[0].abi,
      functionName: "addEntryToCurrentLogbook",
      args: [flightIPFS],
    });

    navigate(`/dashboard?flightIPFS=${flightIPFS}`);
  }

  const flightForm = useForm<z.infer<typeof flightSchema>>({
    resolver: zodResolver(flightSchema),
    defaultValues: {
      date: new Date(),
      departure: {
        place: "",
        time: "",
      },
      arrival: {
        place: "",
        time: "",
      },
      aircraft: {
        model: "",
        registration: "",
      },
      pics: "",
      singlePilotTime: {
        singleEngine: true,
        multiEngine: false,
      },
      totalTimeOfFlight: {
        hours: 0,
        minutes: 0,
      },
      numberOfLandings: {
        day: 0,
        night: 0,
      },
      remarks: "",
      selfSigned: true,
      signedBy: "",
    },
  });

  return (
    <Form {...flightForm}>
      <form
        onSubmit={flightForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 mx-auto"
      >
        <FormField
          control={flightForm.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-xl font-bold">Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[280px] justify-start text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormLabel className="text-xl font-bold">Departure</FormLabel>
        <div className="flex gap-4">
          <FormField
            control={flightForm.control}
            name="departure.place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place</FormLabel>
                <FormControl>
                  <Input placeholder="LELL" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={flightForm.control}
            name="departure.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="12:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-xl font-bold">Arrival</FormLabel>
        <div className="flex gap-4">
          <FormField
            control={flightForm.control}
            name="arrival.place"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Place</FormLabel>
                <FormControl>
                  <Input placeholder="LEGE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={flightForm.control}
            name="arrival.time"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Time</FormLabel>
                <FormControl>
                  <Input placeholder="13:00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-xl font-bold">Aircraft</FormLabel>
        <div className="flex gap-4">
          <FormField
            control={flightForm.control}
            name="aircraft.model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="C150" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={flightForm.control}
            name="aircraft.registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Registration</FormLabel>
                <FormControl>
                  <Input placeholder="YL-NLO" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-xl font-bold">PICs</FormLabel>
        <FormField
          control={flightForm.control}
          name="pics"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name(s)</FormLabel>
              <FormControl>
                <Input placeholder="SELF" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={flightForm.control}
          name="selfSigned"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-bold">Self Signed</FormLabel>
              <div className="flex gap-4">
                <FormControl>
                  <Checkbox
                    checked={selfSigned}
                    onCheckedChange={() => {
                      setSelfSigned(!selfSigned);
                      field.onChange(!selfSigned);
                    }}
                    className="self-center"
                  />
                </FormControl>
                <FormDescription>
                  If you are the PIC signing the flight, please check this box.
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        {!selfSigned && (
          <div className="flex gap-4">
            <FormField
              control={flightForm.control}
              name="signedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Signed By</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="instructor.eth" />
                  </FormControl>
                  <FormDescription>
                    The address of the pilot who signed the flight.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <FormLabel className="text-xl font-bold">Single Pilot Time</FormLabel>
          <div className="flex gap-4">
            <FormField
              control={flightForm.control}
              name="singlePilotTime.singleEngine"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-1">
                    <FormLabel>Single Engine</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange(true);
                          flightForm.setValue(
                            "singlePilotTime.multiEngine",
                            false
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={flightForm.control}
              name="singlePilotTime.multiEngine"
              render={({ field }) => (
                <FormItem>
                  <div className="flex gap-1">
                    <FormLabel>Multi Engine</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={() => {
                          field.onChange(true);
                          flightForm.setValue(
                            "singlePilotTime.singleEngine",
                            false
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormLabel className="text-xl font-bold">Time of flight</FormLabel>
        <div className="flex gap-4">
          <FormField
            control={flightForm.control}
            name="totalTimeOfFlight.hours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hours</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="01"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={flightForm.control}
            name="totalTimeOfFlight.minutes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minutes</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="30"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-xl font-bold">Landings</FormLabel>
        <div className="flex gap-4">
          <FormField
            control={flightForm.control}
            name="numberOfLandings.day"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Day</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="1"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={flightForm.control}
            name="numberOfLandings.night"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Night</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.target.valueAsNumber);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormLabel className="text-xl font-bold">Remarks</FormLabel>
        <FormField
          control={flightForm.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save flight</Button>
      </form>
    </Form>
  );
}
