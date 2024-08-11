import { licenseSchema } from "@/lib/eas";
import { useEthersProvider } from "@/lib/ethers";
import {
  SchemaEncoder,
  SchemaRegistry,
} from "@ethereum-attestation-service/eas-sdk";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function LicensePage() {
  const [searchParams] = useSearchParams();
  const provider = useEthersProvider();
  const licenseCid = searchParams.get("cid");
  const [license, setLicense] = useState<any>(null);
  const [decodedLicense, setDecodedLicense] = useState<any[]>([]);

  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );

  // @ts-expect-error: provider is not properly typed
  schemaRegistry.connect(provider);

  useEffect(() => {
    if (licenseCid) {
      async function getLicense() {
        const response = await axios.get(
          `https://gateway.lighthouse.storage/ipfs/${licenseCid}`
        );
        setLicense(response.data);
      }
      getLicense();
    }
  }, [licenseCid]);

  useEffect(() => {
    async function getSchema() {
      if (!license) return;
      const schema = await schemaRegistry.getSchema({ uid: licenseSchema });
      const schemaEncoder = new SchemaEncoder(schema.schema);
      const decoded = schemaEncoder.decodeData(license.message.data);
      setDecodedLicense(decoded);
    }
    getSchema();
  }, [license]);

  return (
    <div>
      <h1>License</h1>
      <pre>{JSON.stringify(decodedLicense, null, 2)}</pre>
    </div>
  );
}
