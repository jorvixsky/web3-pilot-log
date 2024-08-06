import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Pilot Log", function() {

    async function deployPilotLog() {

        // Contracts are deployed using the first signer/account by default
        const [owner, ...accounts] = await hre.viem.getWalletClients();

        const pilotLog = await hre.viem.deployContract("PilotLog");

        const publicClient = await hre.viem.getPublicClient();

        return {
            pilotLog,
            owner,
            accounts,
            publicClient,
        };
    }

    it("Should deploy", async function() {
        const { pilotLog,
            owner,
            accounts,
            publicClient
         }  = await loadFixture(deployPilotLog)
        expect(pilotLog.address).to.not.be.undefined;
        expect(true).to.be.true;
    })
    it("Should be able to manage users", async function() {
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // no pilot created = no info
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('');
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).profileCid).to.equals('');
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).profileCid).to.equals('');

        // create a pilot only generates data for the pilot
        const firstAccountContract = await hre.viem.getContractAt(
            "PilotLog",
            pilotLog.address,
            { client: {wallet: accounts[0]} }
        )
        await firstAccountContract.write.registerProfile(['myIpfsCid', 0]);
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('myIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).userType).to.equals(0);
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).profileCid).to.equals('');
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).profileCid).to.equals('');

        // cannot create user twice
        await expect(firstAccountContract.write.registerProfile(['myIpfsCid', 0])).to.be.rejectedWith(
            "User already registered"
        );

        // can create a signer
        const secondAccountContract = await hre.viem.getContractAt(
            "PilotLog",
            pilotLog.address,
            { client: {wallet: accounts[1]} }
        )
        await secondAccountContract.write.registerProfile(['secondIpfsCid', 1]);
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('myIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).userType).to.equals(0);
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).profileCid).to.equals('secondIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).userType).to.equals(1);
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).profileCid).to.equals('');

        // can create an entity
        const thirdAccountContract = await hre.viem.getContractAt(
            "PilotLog",
            pilotLog.address,
            { client: {wallet: accounts[2]} }
        )
        await thirdAccountContract.write.registerProfile(['thirdIpfsCid', 2]);
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('myIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).userType).to.equals(0);
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).profileCid).to.equals('secondIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).userType).to.equals(1);
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).profileCid).to.equals('thirdIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).userType).to.equals(2);

        // can promote pilot to signer
        await firstAccountContract.write.promoteToSigner();
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('myIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).userType).to.equals(1);

        // no pilots cannot promote to signer
        await expect(secondAccountContract.write.promoteToSigner()).to.be.rejectedWith(
            "User not pilot"
        );
        await expect(thirdAccountContract.write.promoteToSigner()).to.be.rejectedWith(
            "User not pilot"
        );
    })
})