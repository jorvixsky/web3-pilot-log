import useEAS from "@/hooks/useEAS";
import { licenseSchemaEncoder } from "@/lib/eas";
import { useEthersSigner } from "@/lib/ethers";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { licenseSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Licenses } from "@/lib/enums";
import { Ratings } from "@/lib/enums";
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
import { Checkbox } from "../ui/checkbox";

export default function NewLicense() {
  const eas = useEAS();
  const signer = useEthersSigner();

  eas.connect(signer); // TODO: Properly handle undefined case

  const licenseData = [
    { name: "name", value: "John Doe", type: "string" },
    { name: "licenseNumber", value: "ESP.FCL.0000000", type: "string" },
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

  const [checkedLicenses, setCheckedLicenses] = useState<string[]>([]);
  const [checkedRatings, setCheckedRatings] = useState<string[]>([]);

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
                    <Input placeholder="ESP.FCL.0000000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel>Licenses</FormLabel>
            {Object.values(Licenses).map((license) => {
              return (
                <FormItem key={license}>
                  <FormControl>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <Checkbox
                          checked={checkedLicenses.includes(license)}
                          onCheckedChange={() => {
                            const newCheckedLicenses = checkedLicenses.includes(
                              license
                            )
                              ? checkedLicenses.filter((l) => l !== license)
                              : [...checkedLicenses, license];
                            setCheckedLicenses(newCheckedLicenses);
                            licenseForm.setValue(
                              "licenses",
                              newCheckedLicenses.map((l) => ({
                                name: l,
                                issueDate: "",
                                licenseNumber: "",
                              }))
                            );
                          }}
                        />
                        <FormLabel>{license}</FormLabel>
                      </div>
                      {checkedLicenses.includes(license) && (
                        <div className="mt-2">
                          <div className="flex gap-2">
                            <FormControl>
                              <Input placeholder="Issue Date" />
                            </FormControl>
                            <FormControl>
                              <Input placeholder="License Number" />
                            </FormControl>
                          </div>
                        </div>
                      )}
                    </div>
                  </FormControl>
                </FormItem>
              );
            })}
            <FormLabel>Ratings</FormLabel>
            {Object.values(Ratings).map((rating) => {
              return (
                <FormItem key={rating}>
                  <FormControl>
                    <div className="flex items-center">
                      <Checkbox
                        checked={checkedRatings.includes(rating)}
                        onCheckedChange={() => {
                          const currentRatings =
                            licenseForm.getValues("ratings") ?? [];
                          const newRatings = currentRatings.includes(rating)
                            ? currentRatings.filter((r) => r !== rating)
                            : [...currentRatings, rating];
                          setCheckedRatings(newRatings);
                          licenseForm.setValue("ratings", newRatings);
                        }}
                      />
                      <FormLabel>{rating}</FormLabel>
                    </div>
                  </FormControl>
                </FormItem>
              );
            })}
            <Button type="submit">Save license</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
