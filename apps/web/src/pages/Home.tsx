import Header from "@/components/common/header";
import ConfigureLighthouse from "@/components/lighthouse/configure";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <>
      <Header />
      <div className="flex flex-col gap-4 mx-auto justify-center items-center mt-8">
        <h1 className="text-4xl font-bold">Welcome to Web3 Pilot Logbook!</h1>
        {!isConnected && (
          <>
            <h2 className="text-2xl font-bold">
              Connect your wallet to get started
            </h2>
            <ConnectButton />
          </>
        )}
        {isConnected && (
          <div className="flex flex-col gap-4 justify-center items-center max-w-lg">
            <h2 className="text-2xl font-bold">Login</h2>
            <p className="text-center">
              We use{" "}
              <a href="https://www.lighthouse.storage/" className="underline">
                lighthouse.storage
              </a>{" "}
              to safely store your flight license and logbook. Please, click
              login and sign the message to continue.
            </p>
            <ConfigureLighthouse />
          </div>
        )}
      </div>
    </>
  );
}
