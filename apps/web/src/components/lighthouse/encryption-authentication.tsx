import { useAccount, useSignMessage } from "wagmi";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import axios from "axios";

export default function EncryptionAuthentication() {
  const [message, setMessage] = useState<string | null>(null);
  const { address } = useAccount();

  useEffect(() => {
    async function fetchMessage() {
      const response = await axios.get(
        `https://encryption.lighthouse.storage/api/message/${address}`
      );
      setMessage(response.data[0].message);
    }
    fetchMessage();
  }, []);

  const {
    data: signedMessageData,
    signMessage,
    error,
    status,
  } = useSignMessage();

  useEffect(() => {
    async function requestJWT() {
      if (!signedMessageData || !address) return;
      const response = await axios.post(
        `https://encryption.lighthouse.storage/api/message/get-jwt`,
        {
          signature: signedMessageData,
          address: address,
        }
      );
      sessionStorage.setItem("jwt", response.data.token);
      sessionStorage.setItem("refreshToken", response.data.refreshToken);
    }
    requestJWT();
  }, [signedMessageData]);

  return (
    <>
      {message && (
        <Button
          onClick={() => signMessage({ message })}
          disabled={status === "pending"}
        >
          Sign Message
        </Button>
      )}
      {error && <div>{error.message}</div>}
    </>
  );
}
