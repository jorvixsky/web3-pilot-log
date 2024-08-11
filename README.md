# web3-pilot-log

This is a turborepo template intended to be used to start new web3 projects, containing the following:

## Deployments

Our contracts have been deployed to Optimism Sepolia and Base Sepolia (testnet only as there are improvements to be made before entering production). Check the following Blockscout URLs to see the contracts:

[Optimism Sepolia](https://optimism-sepolia.blockscout.com/address/0x11A9872861C940D880EF82475C233DA2Ff993DF8?tab=contract_code)

[Base Sepolia](https://base-sepolia.blockscout.com/address/0xc3F0373877C5D20Dd48aAA7c782D0C8e14B3cFE2?tab=contract_code)

## Apps and Packages

- `apps/web`: a [Vite](https://vitejs.dev) project including:
    - [React Router](https://reactrouter.com/en/main) configured with HashRouter for enhanced compatibility with IPFS-deployed applications.
    - [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/) and [TanStack Query](https://tanstack.com/query/latest) to handle blockchain actions.
    - [RainbowKit](https://www.rainbowkit.com/) for wallet connection.
    - [Tailwindcss](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for components.
- `packages/hardhat`: a [hardhat](https://hardhat.org/) with [Viem](https://viem.sh/) project including:
    -  [hardhat-chai-matchers-viem](https://www.npmjs.com/package/hardhat-chai-matchers-viem), a package to enable Ethereum-specific capabilities to [Chai](https://www.chaijs.com/) for testing when using Viem.
    -  A simple example `Counter` contract, including source code, test and ignition deployment scripts. Intended to be used with the sample Vite application.
