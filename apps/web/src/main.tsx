import React from "react";
import ReactDOM from "react-dom/client";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "./wagmi";
import App from "./pages/Home.tsx";
import "@rainbow-me/rainbowkit/styles.css";
import "./index.css";
import { RouterProvider, createHashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import Dashboard from "./pages/Dashboard.tsx";
import AuthenticateLighthouse from "./pages/AuthenticateLighthouse.tsx";
import NewFlightPage from "./pages/NewFlight.tsx";
import ShareLogbookPage from "./pages/ShareLogbook.tsx";
import SignerEntries from "./pages/SignerEntries.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/authenticate",
    element: <AuthenticateLighthouse />,
  },
  {
    path: "/new-flight",
    element: <NewFlightPage />,
  },
  {
    path: "/share-logbook",
    element: <ShareLogbookPage />,
  },
  {
    path: "/signer-entries",
    element: <SignerEntries />,
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>
);
