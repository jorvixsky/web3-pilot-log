import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import contract from "../contracts.json";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract, useWriteContract } from "wagmi";
import { Button } from "./components/ui/button";

function App() {
  const counter = useReadContract({
    address: contract[0].address as `0x${string}`,
    abi: contract[0].abi,
    functionName: "count",
  });

  const { writeContract } = useWriteContract();

  const increment = () => {
    writeContract({
      address: contract[0].address as `0x${string}`,
      abi: contract[0].abi,
      functionName: "increment",
    });
  };

  const count = counter.data ? counter.data.toString() : "0";

  return (
    <div className="bg-[#708090] flex flex-col items-center justify-center gap-8 pt-20">
      <div className="flex gap-4">
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo w-44 h-44" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className="logo react w-44 h-44"
            alt="React logo"
          />
        </a>
      </div>
      <h1 className="text-white font-bold text-4xl">Vite + React</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ConnectButton />
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <Button variant="secondary" onClick={increment}>
          count is {count}
        </Button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-white">
          Click on the Vite and React logos to learn more
        </p>
        <p className="text-white">
          This is ugly as fuck, I know. Help me make this page prettier 😄
        </p>
        <a href="https://github.com/jorvixsky/crypto-template" target="_blank">
          Contribute here!
        </a>
      </div>
    </div>
  );
}

export default App;
