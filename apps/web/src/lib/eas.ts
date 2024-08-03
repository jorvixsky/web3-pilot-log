import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const licenseSchemaEncoder = new SchemaEncoder(
  "string name,string licenseNumber,string[] licenses,string[] ratings,string[] aircraftTypeRatings"
);

export const easBaseSepolia = new EAS(
  "0x4200000000000000000000000000000000000021"
);

export const easOptimismSepolia = new EAS(
  "0x4200000000000000000000000000000000000021"
);
