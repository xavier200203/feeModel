const { ethers: hEether} = require('hardhat');
const {
    readConfig
} = require('./utils/helper')

const main = async () => {
    let gasPrice = 0x02540be400,gasLimit=0x7a1200
    
    let chainId = await getChainId();
    console.log("chainId is :" + chainId);

    let accounts = await hEether.getSigners();
    let admin = accounts[0];

    let feeModelAddress = await readConfig("0","FEE_MODEL_ADDRESS");
    console.log("fee model address: ",feeModelAddress);

  
    const feeModelFacotry = await ethers.getContractFactory('feeModel',admin)
    let feeModelContract  = await feeModelFacotry.connect(admin).attach(feeModelAddress);


    let ret = await feeModelContract.divideMoney(
        { gasPrice: gasPrice, gasLimit: gasLimit}
    );
    // console.log(ret);

    let rep = await ret.wait();
    // console.log(rep.status);
    if(rep.status == 1){
        console.log("divide Money OK");
    }else{
        console.log("divide Money Error");
    }

    

}

main();
