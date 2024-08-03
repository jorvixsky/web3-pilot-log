import useEAS from "@/hooks/useEAS";
import { licenseSchemaEncoder } from "@/lib/eas";
import { useEthersSigner } from "@/lib/ethers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { licenseSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function NewLicense() {
  const eas = useEAS();
  const signer = useEthersSigner();

  // @ts-expect-error: This is not properly typed as it comes from an adapter from viem to ethers
  eas.connect(signer);

  const licenseData = [
    { name: "name", value: "John Doe", type: "string" },
    { name: "licenseNumber", value: "123456", type: "string" },
    { name: "licenses", value: ["PPL", "CPL"], type: "string[]" },
    {
      name: "ratings",
      value: ["Aircraft, Sailplane"],
      type: "string[]",
    },
    {
      name: "aircraftTypeRatings",
      value: ["Boeing 737", "Airbus A320"],
      type: "string[]",
    },
  ];

  function onSubmit(values: z.infer<typeof licenseSchema>) {
    console.log(values);
  }

  const licenseForm = useForm<z.infer<typeof licenseSchema>>({
    resolver: zodResolver(licenseSchema),
    defaultValues: {
      name: "",
      licenseNumber: "",
      licenses: [],
      ratings: [],
      aircraftTypeRatings: [],
    },
  });

  const encodedLicenseData = licenseSchemaEncoder.encodeData(licenseData);

  const [date, setDate] = useState<Date | undefined>(new Date());

  const ratings = [
    { label: "Student Pilot", value: "Student Pilot" },
    { label: "Private Pilot", value: "Private Pilot" },
    { label: "Commercial Pilot", value: "Commercial Pilot" },
    { label: "Airline Transport Pilot", value: "Airline Transport Pilot" },
  ];

  return (
    <div>
      <h1>License</h1>
      <div>
        <Form {...licenseForm}>
          <form
            onSubmit={licenseForm.handleSubmit(onSubmit)}
            className="flex flex-col gap-3 w-96"
          >
            <FormField
              control={licenseForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={licenseForm.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input placeholder="123456" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Save license</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
