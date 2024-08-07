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

    async function getAccountContract(address: `0x${string}`, account : any){
        return await hre.viem.getContractAt(
            "PilotLog",
            address,
            { client: {wallet: account} }
        )
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
        const firstAccountContract = await getAccountContract(pilotLog.address, accounts[0]);
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
        const secondAccountContract = await await getAccountContract(pilotLog.address, accounts[1]);
        await secondAccountContract.write.registerProfile(['secondIpfsCid', 1]);
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).profileCid).to.equals('myIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[0].account.address])).userType).to.equals(0);
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).profileCid).to.equals('secondIpfsCid');
        expect((await pilotLog.read.getUserProfile([accounts[1].account.address])).userType).to.equals(1);
        expect((await pilotLog.read.getUserProfile([accounts[2].account.address])).profileCid).to.equals('');

        // can create an entity
        const thirdAccountContract = await getAccountContract(pilotLog.address, accounts[2]);
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

    

    it("Should be able manage books and add entries", async function() {
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const contracts = [
            await getAccountContract(pilotLog.address, accounts[0]), // owner
            await getAccountContract(pilotLog.address, accounts[1]), // with account & permissions
            await getAccountContract(pilotLog.address, accounts[2]), // without account & with permissions
            await getAccountContract(pilotLog.address, accounts[3]) // with account & without permissions
        ];

        const addresses = [
            accounts[0].account.address,
            accounts[1].account.address,
            accounts[2].account.address,
            accounts[3].account.address
        ]
        
        // can get profile & logbook from themselves
        await contracts[0].write.registerProfile(['myIpfsCid', 0]);
        await contracts[1].write.registerProfile(['myIpfsCid', 0]);
        await contracts[3].write.registerProfile(['myIpfsCid', 1]);
        
        // this should be ok and it's not
        await expect((await contracts[0].read.getSenderAddress())).to.equals(addresses[0]);

        // await expect((await contracts[0].read.getLogbooks([addresses[0]])).closedBooksCount).to.equals(0);
        // await expect(contracts[1].read.getLogbooks([addresses[0]])).to.be.rejectedWith(
        //     "User not allowed"
        // );
        // await contracts[0].write.giveLogbookPermission([addresses[1]]);
        //await expect((await contracts[1].read.getLogbooks([addresses[0]])).closedBooksCount).to.equals(0);

    })
})