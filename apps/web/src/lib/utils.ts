import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringifyAttestation(obj: SignedOffchainAttestation): string {
  // @ts-ignore: key not being used
  return JSON.stringify(obj, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
}
