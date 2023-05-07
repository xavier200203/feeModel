const {
    readConfig, sleep
} = require('./utils/helper')

const { ethers: hEether,upgrades } = require('hardhat');


const main = async () => {
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let owner = accounts[0];

    let lnbridge = await readConfig("config", "LNBRIDGE");
    console.log("withdraw Address :",lnbridge);

    const withdraw = await ethers.getContractFactory('LNBridge',owner);

    const instanceV1 = await withdraw.attach(lnbridge);

    let version = await instanceV1.getVersion();
    console.log("instanceV1", instanceV1.address, "version", version);

    const submitters = [
        "0x53781E106a2e3378083bdcEdE1874E5c2a7225f8"
    ];

    const lnBridgeV2 = await ethers.getContractFactory("LNBridge", owner);
    await upgrades.upgradeProxy(
        lnbridge,
        lnBridgeV2,
        {args: [submitters]},
        {call:"_init_"},

    );
    await sleep(15000);
    console.log('lnBridgeV2 upgraded ! ');

    const instanceV2 = await lnBridgeV2.attach(lnbridge);
    version = await instanceV2.getVersion();
    console.log("instanceV2", instanceV2.address, "version", version);

}

main();
