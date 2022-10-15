const web3 = require("web3");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const { getContractAddress } = require("ethers/lib/utils");
const hre = require("hardhat");
class TestHelper {
  users = {};
  contracts = {};

  static largeApproval = web3.utils
    .toWei("10000000000000000000000000000")
    .toString();
  static largeApproval2 = web3.utils
    .toWei("10000000000000000000000000000")
    .toString();

  deployContract = async () => {
    await this._configureAccounts();
    await this._deployContract(this.users);
  };

  _deployContract = async (users) => {
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    const weth = await ethers.getContractAt(
      "contracts/interfaces/IERC20.sol:IERC20",
      wethAddress
    );
    const dai = await ethers.getContractAt(
      "contracts/interfaces/IERC20.sol:IERC20",
      daiAddress
    );

    //Impersonate to get WETH
    const holder_weth = "0x8EB8a3b98659Cce290402893d0123abb75E3ab28"; //Avax Bridge : 100_000 Weth on this address
    const thousand = ethers.utils.parseEther("1000");
    const beneficiaries = [users.owner.address];
    await this.giveTokenByImpersonating(
      wethAddress,
      holder_weth,
      beneficiaries,
      thousand
    );

    // //Impersonate to get DAI
    // const holder_dai = "0x075e72a5eDf65F0A5f44699c7654C1a76941Ddc8"; //Avax Bridge : 250 M Dai on this address
    // const tenMillion = ethers.utils.parseEther("10000000");
    // const beneficiaries = [users.owner.address];
    // await this.giveTokenByImpersonating(
    //   daiAddress,
    //   holder_dai,
    //   beneficiaries,
    //   tenMillion
    // );

    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy();
    await greeter.deployed();

    const currentContracts = this.contracts || {};
    this.contracts = {
      ...currentContracts,
      ...{ weth, dai },
    };
  };
  deploySimpleStore = async () => {
    // await this._configureAccounts();
    await this._deploySimpleStore();
  };

  _deploySimpleStore = async () => {
    const SimpleStore = await ethers.getContractFactory("SimpleStore");
    const simpleStore = await SimpleStore.deploy();
    await simpleStore.deployed();

    const currentContracts = this.contracts || {};
    this.contracts = {
      ...currentContracts,
      ...{ simpleStore },
    };
  };

  _configureAccounts = async () => {
    const signers = await ethers.getSigners();
    const owner = signers[0];
    const user1 = signers[1];
    const user2 = signers[2];
    const user3 = signers[3];
    const user4 = signers[4];

    // Make users available for tests
    const currentUsers = this.users;
    this.users = {
      currentUsers,
      ...{ owner, user1, user2, user3, user4 },
    };
  };

  giveTokenByImpersonating = async (
    tokenAddress,
    owner,
    beneficiaries,
    amountEach
  ) => {
    await hre.network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [owner],
    });
    const signer = await ethers.getSigner(owner);

    const impersonate = await ethers.getContractAt(
      "contracts/interfaces/IERC20.sol:IERC20",
      tokenAddress,
      signer
    );
    if (beneficiaries instanceof String) {
      beneficiaries = [beneficiaries];
    }

    for (const beneficiary of beneficiaries) {
      await impersonate.transfer(beneficiary, amountEach);
    }

    await hre.network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [owner],
    });
  };

  async giveToken(tokenContract, recipient, amount, decimals, addressApproval) {
    tokenContract
      .connect(this.users.owner)
      .approve(addressApproval, this.largeApproval2);
    tokenContract
      .connect(this.users.owner)
      .transfer(recipient, this.bigNumberFactory(amount, decimals));
  }

  bigNumberFactory = async (number, decimals) => {
    return BigNumber.from(number).mul(BigNumber.from(10).pow(decimals));
  };
}

module.exports = TestHelper;
