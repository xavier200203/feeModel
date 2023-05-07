/* External Imports */
const { ethers, upgrades} = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
chai.use(solidity)
const { utils } = require('ethers')
require("@nomiclabs/hardhat-web3");


describe(`feeModel Test `, () => {

  let admin,alice,chainID,feeModelContract
  let gasPrice = 0x02540be400,gasLimit=0x7a1200
  before(`load accounts and chainID`, async () => {

    [admin,alice] = await ethers.getSigners()
    console.log("admin : ",admin.address," alice : ",alice.address);

    chainID = await getChainId();
    console.log("chainID is :" + chainID);

    const feeModelFactory = await ethers.getContractFactory("feeModel",admin);
    // feeModelContract = await feeModelFactory.deploy();
    // function __FeeModel_init(
    //   address minterAddress,
    //   uint256 minterRatio,
    //   address dexAddress,
    //   uint256 dexRatio,
    //   address foundationAddress,
    //   uint256 foundationRatio,
    //   uint256 ratioMax

    feeModelContract = await upgrades.deployProxy(
      feeModelFactory,
      [
          "0x41eA6aD88bbf4E22686386783e7817bB7E82c1ed",1000,
          "0x4f2C793DB2163A7A081b984E6E8e2c504825668b",2000,
          "0x7853D8299FE390cEaf0E75449F497d687e769D27",7000,
          10000,
      ],
      {
          initializer: "__FeeModel_init",
          unsafeAllowLinkedLibraries: true,
      },
      { gasPrice: gasPrice, gasLimit: gasLimit}
  );

  })
  
  it(`send fee `, async () => {
    try{
      // let balance = await ebtcContract.balanceOf(alice.address);
      console.log("feeModelContract", feeModelContract.address)

      const receipt = await web3.eth.sendTransaction({
        from: admin.address,
        to: feeModelContract.address,
        value: web3.utils.toWei('1', 'ether'),
      });

      console.log("xxl receipt status : ",receipt.status);

      const balanceObj = await feeModelContract.getAllBalances();
      console.log(balanceObj);

      expect(balanceObj[0].toString()).to.equal("100000000000000000");
      expect(balanceObj[1].toString()).to.equal("700000000000000000");
      expect(balanceObj[2].toString()).to.equal("200000000000000000");
      

    } catch (e) {
      console.log("error ");
      console.log(e);
    }

  })
})
