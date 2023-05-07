const {
    deployLNBridge, deployERC20Handler,targetChainType, sleep,
    writeConfig, attachEBTC, readConfig
} = require('./utils/helper')

const { ethers: hEether } = require('hardhat');
const {parseUnits} = require("ethers/lib/utils");

const submitters = [
    "0x53781E106a2e3378083bdcEdE1874E5c2a7225f8"
];

const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);
    let args = {submitters: submitters};
    let accounts = await hEether.getSigners();
    let admin = accounts[0];
    let lnBridge = await deployLNBridge(admin, args);
    console.log("lnBridge proxy address:", lnBridge.address);
    writeConfig("config", "config", "LNBRIDGE", lnBridge.address);

    args.bridgeAddress = lnBridge.address;
    await sleep(10000)
    let ercHandlerContract = await deployERC20Handler(admin,args);
    console.log("erc Handler Contract :",ercHandlerContract.address);
    writeConfig("config", "config", "BTCHandler", ercHandlerContract.address);

    let ebtcAddress = await readConfig("config", "EBTC");
    console.log("read eBTC address :", ebtcAddress);
    await sleep(10000);
    let tx = await lnBridge.adminRegisterToken(ercHandlerContract.address, targetChainType, ebtcAddress);
    console.log("adminRegisterToken", "tx.hash", tx.hash);
    await sleep(10000);
    let handler = await lnBridge.getHandlerByChainType(targetChainType);
    console.log("register getHandlerByChainType :", handler);

    process.exit(0)
}

main();
