import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "hardhat-chai-matchers-viem";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.26",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: {
      "base-sepolia":
        process.env.ETHERSCAN_API_KEY ?? "<your-etherscan-api-key>",
      "optimism-sepolia":
        process.env.ETHERSCAN_API_KEY ?? "<your-etherscan-api-key>",
    },
    customChains: [
      {
        network: "optimism-sepolia",
        chainId: 11155420,
        urls: {
          apiURL: "https://optimism-sepolia.blockscout.com/api",
          browserURL: "https://optimism-sepolia.blockscout.com/",
        },
      },
      {
        network: "base-sepolia",
        chainId: 84532,
        urls: {
          apiURL: "https://base-sepolia.blockscout.com/api",
          browserURL: "https://base-sepolia.blockscout.com/",
        },
      },
    ],
  },
  networks: {
    hardhat: {},
    optimismSepolia: {
      url: process.env.ALCHEMY_URL_OP_SEPOLIA ?? "<your-alchemy-url>",
      accounts: [process.env.PRIVATE_KEY ?? "<your-private-key>"],
    },
    baseSepolia: {
      url: process.env.ALCHEMY_URL_BASE_SEPOLIA ?? "<your-base-sepolia-url>",
      accounts: [process.env.PRIVATE_KEY ?? "<your-private-key>"],
    },
  },
  defaultNetwork: "localhost",
};

export default config;
