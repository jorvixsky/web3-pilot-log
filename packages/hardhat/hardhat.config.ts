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
    apiKey: process.env.ETHERSCAN_API_KEY ?? "<your-api-key>",
  },
  networks: {
    hardhat: {},
    optimismSepolia: {
      url: process.env.ALCHEMY_URL_OP_SEPOLIA ?? "<your-alchemy-url>",
      accounts: [process.env.PRIVATE_KEY ?? "<your-private-key>"],
    },
  },
  defaultNetwork: "localhost",
};

export default config;
