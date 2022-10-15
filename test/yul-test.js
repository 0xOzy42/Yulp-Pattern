const { expect } = require("chai");
const { ethers } = require("hardhat");
const TestHelper = require("./Helper");
const helper = new TestHelper();

describe.only("Yul Sample Tests", function () {
  let simpleStore;
  // let owner, user1, user2;
  before(async () => {
    await helper.deploySimpleStore();
    // owner = helper.users.owner;
    // user1 = helper.users.user1;
    // user2 = helper.users.user2;
    simpleStore = helper.contracts.simpleStore;
    // const amount = helper.bigNumberFactory(100, 18);
  });

  it("Check initial", async function () {
    const getStorage = await simpleStore.get();
    console.log(getStorage);
    console.log("hello");
  });
});
