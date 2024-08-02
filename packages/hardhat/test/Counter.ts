import hre from "hardhat";
import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("Deployment", function() {

    async function deployCounter() {
        const counter = await hre.viem.deployContract("Counter");
        return { counter };
    }

    it("Should deploy", async function() {
        const { counter } = await loadFixture(deployCounter)
        expect(counter.address).to.not.be.undefined;
    })
    it("Should be able to count", async function() {
        const { counter } = await loadFixture(deployCounter);
        expect(await counter.read.count()).to.equal(0);
        await counter.write.increment();
        expect(await counter.read.count()).to.equal(1);
    })
})