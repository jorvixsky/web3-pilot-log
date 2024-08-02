# crypto-template

This is a turborepo template intended to be used to start new web3 projects, containing the following:

## Apps and Packages

- `apps/web`: a [Vite](https://vitejs.dev) project including:
    - [React Router](https://reactrouter.com/en/main) configured with HashRouter for enhanced compatibility with IPFS-deployed applications.
    - [Wagmi](https://wagmi.sh/), [Viem](https://viem.sh/) and [TanStack Query](https://tanstack.com/query/latest) to handle blockchain actions.
    - [RainbowKit](https://www.rainbowkit.com/) for wallet connection.
    - [Tailwindcss](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/) for components.
- `packages/hardhat`: a [hardhat](https://hardhat.org/) with [Viem](https://viem.sh/) project including:
    -  [hardhat-chai-matchers-viem](https://www.npmjs.com/package/hardhat-chai-matchers-viem), a package to enable Ethereum-specific capabilities to [Chai](https://www.chaijs.com/) for testing when using Viem.
    -  A simple example `Counter` contract, including source code, test and ignition deployment scripts. Intended to be used with the sample Vite application.
