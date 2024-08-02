import logo from "/logo.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <header className="flex justify-between p-3 bg-slate-100">
      <a href="/">
        <img src={logo} className="h-14 w-14" />
      </a>
      <div className="self-center">
        <ConnectButton />
      </div>
    </header>
  );
}
