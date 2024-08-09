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

    

    it("Should be able manage books and permissions", async function() {
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
        await contracts[0].write.registerProfile(['myIpfsCid1', 0]);
        await contracts[1].write.registerProfile(['myIpfsCid', 0]);
        await contracts[3].write.registerProfile(['myIpfsCid', 1]);

        // owner
        await expect((await contracts[0].read.getLogbooks([addresses[0]], {
            account: accounts[0].account
        })).closedBooksCount).to.equals(0);
        await expect((await contracts[0].read.getProfile([addresses[0]], {
            account: accounts[0].account
        })).profileCid).to.equals('myIpfsCid1');

        // with account, giving permission
        await expect(contracts[1].read.getLogbooks([addresses[0]], {
            account: accounts[1].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await expect(contracts[1].read.getProfile([addresses[0]], {
            account: accounts[1].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await contracts[0].write.giveLogbookPermission([addresses[1]]);
        await expect((await contracts[1].read.getLogbooks([addresses[0]], {
            account: accounts[1].account
        })).closedBooksCount).to.equals(0);
        await expect((await contracts[1].read.getProfile([addresses[0]], {
            account: accounts[1].account
        })).profileCid).to.equals('myIpfsCid1');

        // with account, without permission
        await expect(contracts[3].read.getLogbooks([addresses[0]], {
            account: accounts[3].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await expect(contracts[3].read.getProfile([addresses[0]], {
            account: accounts[3].account
        })).to.be.rejectedWith(
            "User not allowed"
        );

        // without account, giving permission
        await expect(contracts[2].read.getLogbooks([addresses[0]], {
            account: accounts[2].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await expect(contracts[2].read.getProfile([addresses[0]], {
            account: accounts[2].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await contracts[0].write.giveLogbookPermission([addresses[2]]);
        await expect((await contracts[2].read.getLogbooks([addresses[0]], {
            account: accounts[2].account
        })).closedBooksCount).to.equals(0);
        await expect((await contracts[2].read.getProfile([addresses[0]], {
            account: accounts[2].account
        })).profileCid).to.equals('myIpfsCid1');

        // permissions can be revoked
        await contracts[0].write.revokeLogbookPermission([addresses[1]]);
        await contracts[0].write.revokeLogbookPermission([addresses[2]]);

        await expect(contracts[1].read.getLogbooks([addresses[0]], {
            account: accounts[1].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await expect(contracts[1].read.getProfile([addresses[0]], {
            account: accounts[1].account
        })).to.be.rejectedWith(
            "User not allowed"
        );

        await expect(contracts[2].read.getLogbooks([addresses[0]], {
            account: accounts[2].account
        })).to.be.rejectedWith(
            "User not allowed"
        );
        await expect(contracts[2].read.getProfile([addresses[0]], {
            account: accounts[2].account
        })).to.be.rejectedWith(
            "User not allowed"
        );

    })

    it("Should be able to manage books", async function(){
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const ownerContract = await getAccountContract(pilotLog.address, accounts[0]);
        const ownerAddress = accounts[0].account.address;
        
        // create account
        await ownerContract.write.registerProfile(['myIpfsCid1', 0]);

        // addEntryToCurrentLogbook, closeCurrentLogbook, getLogbooks
        var contractCall = await ownerContract.read.getLogbooks([ownerAddress], {
            account: accounts[0].account
        });
        expect(contractCall.closedBooksCount).to.equals(0);
        expect(contractCall.openBook.id).to.equals('');

        // add 2 entries
        await ownerContract.write.addEntryToCurrentLogbook(['logbook1Entry1Cid']);
        contractCall = await ownerContract.read.getLogbooks([ownerAddress], {
            account: accounts[0].account
        });
        expect(contractCall.closedBooksCount).to.equals(0);
        expect(contractCall.openBook.id).to.equals('logbook1Entry1Cid');
        expect(contractCall.openBook.lastEntryCid).to.equals('logbook1Entry1Cid');

        await ownerContract.write.addEntryToCurrentLogbook(['logbook1Entry2Cid']);
        contractCall = await ownerContract.read.getLogbooks([ownerAddress], {
            account: accounts[0].account
        });
        expect(contractCall.closedBooksCount).to.equals(0);
        expect(contractCall.openBook.id).to.equals('logbook1Entry1Cid');
        expect(contractCall.openBook.lastEntryCid).to.equals('logbook1Entry2Cid');

        // close book
        await ownerContract.write.closeCurrentLogbook();
        contractCall = await ownerContract.read.getLogbooks([ownerAddress], {
            account: accounts[0].account
        });
        expect(contractCall.closedBooksCount).to.equals(1);
        expect(contractCall.closedBook[0].id).to.equals('logbook1Entry1Cid');
        expect(contractCall.closedBook[0].lastEntryCid).to.equals('logbook1Entry2Cid');
        expect(contractCall.openBook.id).to.equals('');
        expect(contractCall.openBook.lastEntryCid).to.equals('');
    })

    it("Only pilots or signers can manage books", async function() {
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const contracts = [
            await getAccountContract(pilotLog.address, accounts[0]), // pilot
            await getAccountContract(pilotLog.address, accounts[1]), // signer
            await getAccountContract(pilotLog.address, accounts[2]), // entity
        ];
        const addresses = [
            accounts[0].account.address,
            accounts[1].account.address,
            accounts[2].account.address
        ]
        
        await contracts[0].write.registerProfile(['myIpfsCidPilot', 0]);
        await contracts[1].write.registerProfile(['myIpfsCidSigner', 1]);
        await contracts[2].write.registerProfile(['myIpfsCidEntity', 2]);

        // addEntryToCurrentLogbook
        await expect(contracts[0].write.addEntryToCurrentLogbook([""])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[1].write.addEntryToCurrentLogbook([""])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[2].write.addEntryToCurrentLogbook([""])).to.be.rejectedWith(
            "User not pilot nor signer"
        );
        // addEntryToCurrentLogbook
        await expect(contracts[0].write.closeCurrentLogbook()).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[1].write.closeCurrentLogbook()).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[2].write.closeCurrentLogbook()).to.be.rejectedWith(
            "User not pilot nor signer"
        );
        // giveLogbookPermission
        await expect(contracts[0].write.giveLogbookPermission([addresses[0]])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[1].write.giveLogbookPermission([addresses[1]])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[2].write.giveLogbookPermission([addresses[2]])).to.be.rejectedWith(
            "User not pilot nor signer"
        );
        // revokeLogbookPermission
        await expect(contracts[0].write.revokeLogbookPermission([addresses[0]])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[1].write.revokeLogbookPermission([addresses[1]])).not.to.be.rejectedWith(
            "User not pilot nor signer"
        );
        await expect(contracts[2].write.revokeLogbookPermission([addresses[2]])).to.be.rejectedWith(
            "User not pilot nor signer"
        );
    });

    it("Should be able to ask for validations and validate", async function(){
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const contracts = [
            await getAccountContract(pilotLog.address, accounts[0]), // owner
            await getAccountContract(pilotLog.address, accounts[1]), // signer
            await getAccountContract(pilotLog.address, accounts[2]), // no signer asked to sign
            await getAccountContract(pilotLog.address, accounts[3]), // no account asked to sign
            await getAccountContract(pilotLog.address, accounts[4]), // signer without asking to sign
        ];
        const addresses = [
            accounts[0].account.address,
            accounts[1].account.address,
            accounts[2].account.address,
            accounts[3].account.address,
            accounts[4].account.address
        ]
        
        await contracts[0].write.registerProfile(['myIpfsCid1', 0]);
        await contracts[1].write.registerProfile(['myIpfsCidSigner', 1]);
        await contracts[2].write.registerProfile(['myIpfsCidPilot', 0]);
        await contracts[4].write.registerProfile(['myIpfsCidPilot', 1]);

        // signer can sign with closed book
        await contracts[0].write.addEntryToCurrentLogbook(['logbook1Entry1Cid']);
        await contracts[0].write.addEntryWithValidator(['logbook1Entry2Cid', addresses[1]]);
        await contracts[0].write.addEntryToCurrentLogbook(['logbook1Entry3Cid']);
        await contracts[0].write.closeCurrentLogbook();
        await contracts[0].write.addEntryToCurrentLogbook(['logbook2Entry1Cid']);
        await contracts[0].write.addEntryWithValidator(['logbook2Entry2Cid', addresses[1]]);
        await contracts[0].write.addEntryToCurrentLogbook(['logbook2Entry3Cid']);

        var contractCall = await contracts[0].read.getEntriesToValidate({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(2);
        contractCall = await contracts[0].read.getValidatedEntries({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(0);

        await expect(contracts[4].write.validateEntry([addresses[0], 'logbook1Entry1Cid', 'logbook1Entry2Cid'])).to.be.rejectedWith(
            "Is not signer for entry"
        );

        await expect(contracts[1].write.validateEntry([addresses[0], 'logbook1Entry1Cid', 'logbook1Entry2Cid'])).not.to.be.rejectedWith(
            "Is not signer for entry"
        );
        contractCall = await contracts[1].read.getEntriesToValidate({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(1);
        contractCall = await contracts[1].read.getValidatedEntries({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(1);


        // contractCall = await contracts[0].read.getLogbooks([addresses[0]], {
        //     account: accounts[0].account
        // });

        // console.log("closedBook", contractCall.closedBook[0].entryValidation);
        // console.log("openBook", contractCall.openBook.entryValidation);

        // signer can sign open book
        await contracts[1].write.validateEntry([addresses[0], 'logbook2Entry1Cid', 'logbook2Entry2Cid']);
        contractCall = await contracts[1].read.getEntriesToValidate({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(0);
        contractCall = await contracts[1].read.getValidatedEntries({
            account: accounts[1].account
        });
        expect(contractCall.length).to.equals(2);

        // no signer asked to sign
        await contracts[0].write.addEntryWithValidator(['logbook2Entry4Cid', addresses[2]]);
        await expect(contracts[2].write.validateEntry([addresses[0], 'logbook1Entry1Cid', 'logbook1Entry2Cid'])).to.be.rejectedWith(
            "User not signer"
        );

        // no account asked to sign
        await contracts[0].write.addEntryWithValidator(['logbook2Entry4Cid', addresses[2]]);
        await expect(contracts[3].write.validateEntry([addresses[0], 'logbook1Entry1Cid', 'logbook1Entry2Cid'])).to.be.rejectedWith(
            "User not signer"
        );
    });

    it("entities should be able to get info from the pilots who granted them permissions", async function() {
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const contracts = [
            await getAccountContract(pilotLog.address, accounts[0]), // pilot
            await getAccountContract(pilotLog.address, accounts[1]), // signer
            await getAccountContract(pilotLog.address, accounts[2]), // entity
        ];
        const addresses = [
            accounts[0].account.address,
            accounts[1].account.address,
            accounts[2].account.address
        ]
        
        await contracts[0].write.registerProfile(['myIpfsCidPilot', 0]);
        await contracts[1].write.registerProfile(['myIpfsCidSigner', 1]);
        await contracts[2].write.registerProfile(['myIpfsCidEntity', 2]);

        // give permissions
        await contracts[0].write.giveLogbookPermission([addresses[1]]);
        await contracts[0].write.giveLogbookPermission([addresses[2]]);
        await contracts[1].write.giveLogbookPermission([addresses[0]]);
        await contracts[1].write.giveLogbookPermission([addresses[2]]);

        await expect(contracts[2].write.giveLogbookPermission([addresses[1]])).to.be.rejectedWith(
            "User not pilot nor signer"
        );

        // pilots and signers cannot know who granted them permission
        await expect(contracts[0].read.getAllowedPilotProfiles({
            account: accounts[0].account
        })).to.be.rejectedWith(
            "User not entity"
        );
        await expect(contracts[1].read.getAllowedPilotProfiles({
            account: accounts[1].account
        })).to.be.rejectedWith(
            "User not entity"
        );

        var contractCall = await contracts[2].read.getAllowedPilotProfiles({
            account: accounts[2].account
        });
        expect(contractCall.length).to.equal(2);
        expect(contractCall[0].profileCid).to.equal('myIpfsCidPilot');
        expect(contractCall[0].userAddr.toLocaleLowerCase()).to.equal(addresses[0].toLocaleLowerCase());
        expect(contractCall[1].profileCid).to.equal('myIpfsCidSigner');
        expect(contractCall[1].userAddr.toLocaleLowerCase()).to.equal(addresses[1].toLocaleLowerCase());
    });
    it("pilots should know who they grant access to", async function(){
        const { pilotLog,
            owner,
            accounts,
            publicClient
        } = await loadFixture(deployPilotLog);
        // create account contracts to call them from different addresses
        const contracts = [
            await getAccountContract(pilotLog.address, accounts[0]), // pilot
            await getAccountContract(pilotLog.address, accounts[1]), // signer
            await getAccountContract(pilotLog.address, accounts[2]), // entity
        ];
        const addresses = [
            accounts[0].account.address,
            accounts[1].account.address,
            accounts[2].account.address
        ]
        
        await contracts[0].write.registerProfile(['myIpfsCidPilot', 0]);
        await contracts[1].write.registerProfile(['myIpfsCidSigner', 1]);
        await contracts[2].write.registerProfile(['myIpfsCidEntity', 2]);

        // give permissions
        await contracts[0].write.giveLogbookPermission([addresses[1]]);
        await contracts[0].write.giveLogbookPermission([addresses[2]]);
        await contracts[1].write.giveLogbookPermission([addresses[0]]);
        await contracts[1].write.giveLogbookPermission([addresses[2]]);

        await expect(contracts[2].write.giveLogbookPermission([addresses[1]])).to.be.rejectedWith(
            "User not pilot nor signer"
        );

        var contractCall = await contracts[0].read.getGrantedPermissionsToOthers({
            account: accounts[0].account
        });
        expect(contractCall.length).to.equal(2);
        expect(contractCall[0].profileCid).to.equal('myIpfsCidSigner');
        expect(contractCall[0].userAddr.toLocaleLowerCase()).to.equal(addresses[1].toLocaleLowerCase());
        expect(contractCall[1].profileCid).to.equal('myIpfsCidEntity');
        expect(contractCall[1].userAddr.toLocaleLowerCase()).to.equal(addresses[2].toLocaleLowerCase());
    })

})