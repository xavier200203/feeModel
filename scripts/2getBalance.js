const {
    readConfig
} = require('./utils/helper')
const { ethers: hEether, waffle} = require('hardhat');

const main = async () => {
    
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let dex = accounts[1];
    let foundation = accounts[2];

    let feeModelAddress = await readConfig("0","FEE_MODEL_ADDRESS");
    console.log("fee model address: ",feeModelAddress);

    const provider = waffle.provider;
    const feeModelContractBal = await provider.getBalance(feeModelAddress);
    const devBal = await provider.getBalance(dex.address);
    const foundationBal = await provider.getBalance(foundation.address);

    console.log("Fee Model Contract Balance is : ",feeModelContractBal);
    console.log("dev Balance is                : ",devBal);
    console.log("foundationBal Balance is      : ",foundationBal);
}

main();
