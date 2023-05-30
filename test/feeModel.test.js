/* External Imports */
const { ethers, upgrades} = require('hardhat')
const chai = require('chai')
const { solidity } = require('ethereum-waffle')
const { expect } = chai
chai.use(solidity)
const { utils } = require('ethers')
require("@nomiclabs/hardhat-web3");


describe(`feeModel Test `, () => {

  let admin,alice,foundation,dex,chainID,feeModelContract
  let gasPrice = 0x02540be400,gasLimit=0x7a1200
  before(`load accounts and chainID`, async () => {

    [admin,alice,foundation,dex] = await ethers.getSigners()
    console.log("admin : ",admin.address," alice : ",alice.address);

    chainID = await getChainId();
    console.log("chainID is :" + chainID);

    const feeModelFactory = await ethers.getContractFactory("feeModel",admin);
    feeModelContract = await upgrades.deployProxy(
      feeModelFactory,
      [
          dex.address,40,
          foundation.address,60,
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
        value: web3.utils.toWei('1.5', 'ether'),
      });

      console.log("xxl receipt status : ",receipt.status);

      let balance = await web3.eth.getBalance(feeModelContract.address);
      console.log("balance : ",balance);
      let balanceObj = await feeModelContract.getAllBalances();
      console.log(balanceObj);

      let tx = await feeModelContract.divideMoney();
      console.log("divideMoney : ",tx.hash);

      balanceObj = await feeModelContract.getAllBalances();
      console.log(balanceObj);

      expect(balanceObj[0].toString()).to.equal("600000000000000000");
      expect(balanceObj[1].toString()).to.equal("900000000000000000");
      balance = await web3.eth.getBalance(feeModelContract.address);
      console.log("balance : ",balance);

    } catch (e) {
      console.log("error ");
      console.log(e);
    }

  }),

  it(`change radio `, async () => {
    try{

      console.log("radio", feeModelContract.address)

      await feeModelContract.changeRatio(20,80);

      const receipt = await web3.eth.sendTransaction({
        from: admin.address,
        to: feeModelContract.address,
        value: web3.utils.toWei('1', 'ether'),
      });

      console.log("xxl receipt status : ",receipt.status);

      let tx = await feeModelContract.divideMoney();
      console.log("divideMoney : ",tx.hash);

      const balanceObj = await feeModelContract.getAllBalances();
      console.log(balanceObj);

      expect(balanceObj[0].toString()).to.equal("800000000000000000");
      expect(balanceObj[1].toString()).to.equal("1700000000000000000");


    } catch (e) {
      console.log("error ");
      console.log(e);
    }

  })

  it(`change address `, async () => {
    try{
      // let balance = await ebtcContract.balanceOf(alice.address);
      console.log("feeModelContract", feeModelContract.address)

      await feeModelContract.changeOwner(alice.address);
      let ownerAddress = await feeModelContract.getOwnerAddress();

      expect(ownerAddress).to.equal(alice.address);

      await feeModelContract.connect(foundation).changeFoundation(alice.address);
      let foundationAddress = await feeModelContract.getOwnerAddress();

      expect(foundationAddress).to.equal(alice.address);

      await feeModelContract.connect(dex).changeDex(alice.address);
      let dexAddress = await feeModelContract.getOwnerAddress();

      expect(dexAddress).to.equal(alice.address);



    } catch (e) {
      console.log("error ");
      console.log(e);
    }

  })


})
