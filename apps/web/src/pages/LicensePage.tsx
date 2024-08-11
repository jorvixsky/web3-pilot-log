import Header from "@/components/common/header";
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
  const pilotAddress = searchParams.get("pilotAddress");
  const [license, setLicense] = useState<any>(null);
  const [decodedLicense, setDecodedLicense] = useState<any[]>([]);

  const schemaRegistry = new SchemaRegistry(
    "0x4200000000000000000000000000000000000020"
  );

  // @ts-expect-error: provided is not properly typed
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
    <>
      <Header />
      <div className="flex flex-col gap-3 items-center justify-center mx-auto mt-2">
        <h1 className="text-4xl font-bold">License</h1>
        <p>
          <span className="font-bold">This is the license for the pilot:</span>{" "}
          {pilotAddress}
        </p>
        {decodedLicense &&
          decodedLicense.map((license: any, index: number) => (
            <div
              key={index}
              className="p-4 border rounded-lg shadow-md w-full max-w-xl"
            >
              {renderLicenseData(license)}
            </div>
          ))}
      </div>
    </>
  );

  function renderLicenseData(data: any) {
    return Object.keys(data).map((key) => {
      const valueObject = data[key];

      if (valueObject && valueObject.name && valueObject.value) {
        const name = valueObject.name;
        let value = valueObject.value;

        if (Array.isArray(value)) {
          if (value.length === 0 && name === "aircraftTypeRatings") {
            value = "None";
          } else if (name === "ratings") {
            value = value.join(", ");
          } else if (name === "licenses") {
            value = (
              <ul className="list-disc pl-5">
                {value.map((licenseString, idx) => {
                  try {
                    const licenseObj = JSON.parse(licenseString);
                    return (
                      <li key={idx}>
                        <span className="font-bold">
                          {licenseObj.name || ""}
                        </span>{" "}
                        | <span className="font-bold">Issue Date:</span>{" "}
                        {licenseObj.issueDate || "N/A"} |{" "}
                        <span className="font-bold">License Number:</span>{" "}
                        {licenseObj.licenseNumber || "N/A"}
                      </li>
                    );
                  } catch (e) {
                    return <li key={idx}>{licenseString}</li>;
                  }
                })}
              </ul>
            );
          } else {
            value = JSON.stringify(value);
          }
        }

        return (
          <div key={key}>
            <p>
              <span className="font-bold">{formatKey(name)}:</span> {value}
            </p>
          </div>
        );
      }

      return null;
    });
  }

  function formatKey(key: string) {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
