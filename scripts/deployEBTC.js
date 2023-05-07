const {
    deployEBTC, writeConfig, sleep
} = require('./utils/helper')

const { ethers: hEether } = require('hardhat');
const {parseEther, parseUnits} = require("ethers/lib/utils");

const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();

    const decimal = 8;
    const amount = parseUnits("22000000", decimal);
    let eBTC = await deployEBTC(accounts[0]);
    console.log("contract eBTC address:", eBTC.address);
    let tx = await eBTC.mint(accounts[0].address, amount);
    await sleep(15000);
    console.log("mint ebtc address", tx.hash);

    writeConfig("config", "config", "EBTC", eBTC.address);

    let preAmount = parseUnits("100", decimal);
    await eBTC.transfer(accounts[1].address,preAmount);
    await sleep(15000);
    let balance = await eBTC.balanceOf(accounts[1].address);
    console.log("accounts[1]", accounts[1].address, "balance", balance.toString(), "btc", hEether.utils.formatUnits(balance, 8));
}

main();
