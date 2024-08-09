import { EAS, SchemaEncoder } from "@ethereum-attestation-service/eas-sdk";

export const licenseSchemaEncoder = new SchemaEncoder(
  "string name,string licenseNumber,string[] licenses,string[] ratings,string[] aircraftTypeRatings"
);

export const flightsSchemaEncoder = new SchemaEncoder(
  "string flightData,address signer"
);

export const easBaseSepolia = new EAS(
  "0x4200000000000000000000000000000000000021"
);

export const easOptimismSepolia = new EAS(
  "0x4200000000000000000000000000000000000021"
);

export const licenseSchema =
  "0x35a8a3ebd9ec1aed4494fa8905233b100e79ce22a238d0589fdab41763e4ea68";

export const flightsSchema =
  "0x729792a64d6486fa09c88d0cad3b76395f60ba1f8c1a634d4ed286805e0089ac";
