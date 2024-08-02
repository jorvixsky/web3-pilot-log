import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import axios from "axios";
import { Button } from "../ui/button";
import lighthouse from "@lighthouse-web3/sdk";
import { useNavigate } from "react-router-dom";

export default function ConfigureLighthouse() {
  const navigate = useNavigate();
  const { address } = useAccount();
  const [message, setMessage] = useState<string | undefined>(undefined);
  const [accountConfigured, setAccountConfigured] = useState(false);
  const {
    data: signMessageData,
    signMessage,
    error,
    status,
  } = useSignMessage();

  useEffect(() => {
    if (
      sessionStorage.getItem("lighthouseApiKey") &&
      sessionStorage.getItem("lighthouseAccount")
    ) {
      setAccountConfigured(true);
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    if (!address) return;
    const getSignature = async () => {
      try {
        const response = await axios.get(
          `https://api.lighthouse.storage/api/auth/get_message?publicKey=${address}`
        );
        setMessage(response.data);
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    };
    getSignature();
  }, [address]);

  useEffect(() => {
    if (!signMessageData || !address) return;
    console.log("Signature:", signMessageData);
    const getApiKey = async () => {
      try {
        const response = await lighthouse.getApiKey(
          address as string,
          signMessageData
        );
        sessionStorage.setItem("lighthouseApiKey", response.data.apiKey);
        sessionStorage.setItem("lighthouseAccount", address);
        setAccountConfigured(true);
        navigate("/dashboard");
      } catch (error) {
        console.error("Error creating API key:", error);
      }
    };
    getApiKey();
  }, [signMessageData]);

  const handleSignMessage = () => {
    if (message) {
      signMessage({ message });
    }
  };

  return (
    <div>
      {!accountConfigured ? (
        <>
          {message && (
            <Button onClick={handleSignMessage} disabled={status === "pending"}>
              {status === "pending" ? "Signing..." : "Create API Key"}
            </Button>
          )}
          {error && <div>Error signing message: {error.message}</div>}
        </>
      ) : (
        <div>Account configured</div>
      )}
    </div>
  );
}
