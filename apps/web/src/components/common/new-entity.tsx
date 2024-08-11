import useEAS from "@/hooks/useEAS";
import useSelectContract from "@/hooks/useSelectContract";
import { entitySchema } from "@/lib/schemas";
import { useEthersSigner } from "@/lib/ethers";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useState } from "react";
import { entitySchemaEncoder } from "@/lib/eas";
import { stringifyAttestation } from "@/lib/utils";
import lighthouse from "@lighthouse-web3/sdk";
import { useWriteContract } from "wagmi";
import pilotLog from "../../../contracts.json";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function NewEntity() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const eas = useEAS();
  const signer = useEthersSigner();
  const contract = useSelectContract();

  const { writeContractAsync } = useWriteContract();

  if (eas && signer) {
    eas.connect(signer);
  }

  async function onSubmit(values: z.infer<typeof entitySchema>) {
    setIsLoading(true);
    if (!eas) {
      throw new Error("EAS not connected");
    }
    const entityData = [
      { name: "entityName", value: values.name, type: "string" },
    ];

    const encodedEntityData = entitySchemaEncoder.encodeData(entityData);

    const offchain = await eas.getOffchain();

    const offchainAttestation = await offchain.signOffchainAttestation(
      {
        expirationTime: 0n,
        revocable: true,
        time: BigInt(Date.now() / 1000),
        schema:
          "0x8b9de2d007deabec3aef68eab90d9eac8df16d0e9f2377250ef73e2d9b70c4f3",
        data: encodedEntityData,
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

    const entityIPFS = response.data.Hash;

    await writeContractAsync({
      abi: pilotLog[0].abi,
      address: contract,
      functionName: "registerProfile",
      args: [entityIPFS, 2],
    });

    setIsLoading(false);
    navigate("/");
  }

  const entityForm = useForm<z.infer<typeof entitySchema>>({
    resolver: zodResolver(entitySchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <div className="max-w-lg w-full">
      <h2 className="text-2xl font-bold">Entity configuration</h2>
      <p className="text-sm text-gray-500">
        Please, fill in the following fields to configure your entity.
      </p>
      <Form {...entityForm}>
        <form
          onSubmit={entityForm.handleSubmit(onSubmit)}
          className="flex flex-col gpa-3"
        >
          <FormField
            control={entityForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entity name</FormLabel>
                <FormControl>
                  <Input placeholder="My Aeroclub" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
        <Button type="submit" className="w-full">
          Create entity
        </Button>
      </Form>
    </div>
  );
}
