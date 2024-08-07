import useEAS from "@/hooks/useEAS";
import { licenseSchemaEncoder } from "@/lib/eas";
import { useEthersSigner } from "@/lib/ethers";
import { Input } from "@/components/ui/input";
import { licenseSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Licenses } from "@/lib/enums";
import { Ratings } from "@/lib/enums";
import lighthouse from "@lighthouse-web3/sdk";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { stringifyAttestation } from "@/lib/utils";

export default function NewLicense() {
  const eas = useEAS();
  const signer = useEthersSigner();

  if (eas && signer) {
    eas.connect(signer);
  }

  async function onSubmit(values: z.infer<typeof licenseSchema>) {
    if (!eas) {
      throw new Error("EAS not connected");
    }
    if (!values.licenses || !values.ratings) {
      return;
    }
    if (!values.aircraftTypeRatings) {
      values.aircraftTypeRatings = [];
    }
    let stringedLicenses: string[] = [];
    values.licenses.forEach((license) => {
      stringedLicenses.push(JSON.stringify(license));
    });
    const licenseData = [
      { name: "name", value: values.name, type: "string" },
      { name: "licenseNumber", value: values.licenseNumber, type: "string" },
      { name: "licenses", value: stringedLicenses, type: "string[]" },
      { name: "ratings", value: values.ratings, type: "string[]" },
      {
        name: "aircraftTypeRatings",
        value: values.aircraftTypeRatings,
        type: "string[]",
      },
    ];

    const encodedLicenseData = licenseSchemaEncoder.encodeData(licenseData);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        expirationTime: 0n,
        revocable: true,
        time: BigInt(Math.round(Date.now() / 1000)),
        schema:
          "0x35a8a3ebd9ec1aed4494fa8905233b100e79ce22a238d0589fdab41763e4ea68",
        data: encodedLicenseData,
        refUID:
          "0x0000000000000000000000000000000000000000000000000000000000000000",
        recipient: "0x0000000000000000000000000000000000000000",
      },
      // @ts-expect-error: signer is not properly typed
      signer
    );

    const stringifiedOffchainAttestation =
      stringifyAttestation(offchainAttestation);

    const response = await lighthouse.uploadText(
      stringifiedOffchainAttestation,
      sessionStorage.getItem("lighthouseApiKey") ?? ""
    );

    console.log(response);
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
            <FormField
              control={licenseForm.control}
              name="aircraftTypeRatings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter aircraft type ratings"
                      {...field}
                    />
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
