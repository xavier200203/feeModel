const {
    writeConfig, sleep
} = require('./utils/helper')

const { ethers: hEether,upgrades } = require('hardhat');


const main = async () => {
    let gasPrice = 0x02540be400,gasLimit=0x7a1200
    
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let admin = accounts[0];
    let dex = accounts[1];
    let foundation = accounts[2];

    const feeModelFactory = await ethers.getContractFactory("feeModel",admin);
    feeModelContract = await upgrades.deployProxy(
        feeModelFactory,
        [
            dex.address,6000,
            foundation.address,4000,
            10000,
        ],
        {
            initializer: "__FeeModel_init",
            unsafeAllowLinkedLibraries: true,
        },
        { gasPrice: gasPrice, gasLimit: gasLimit}
    );


    await writeConfig(0,0,"FEE_MODEL_ADDRESS",feeModelContract.address);


    

}

main();
