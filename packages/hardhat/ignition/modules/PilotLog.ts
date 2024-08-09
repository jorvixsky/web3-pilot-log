import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PilotLog = buildModule("PilotLog", (m) => {
  const pilotLog = m.contract("PilotLog");

  return { pilotLog };
});

export default PilotLog;
