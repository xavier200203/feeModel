const {
    attachLNBridge, readConfig, sleep
} = require('./utils/helper')

const { ethers: hEether } = require('hardhat');
const {utils} = require("ethers");
require("@nomiclabs/hardhat-web3");

let pendingTxs = [
    "0xfc2a844a39fc641d808398b221b72e1131e6325586f1ce188e3d99749b1824d8"
];

const main = async () => {

    let chainId = await getChainId();
    console.log("chainId is :" + chainId);
    let args = { fee:0,version:"v1.0.0" }
    let accounts = await hEether.getSigners();
    let owner = accounts[0];
    let lnBridgeAddress = await readConfig("config", "LNBRIDGE");
    let contract = await attachLNBridge(owner, lnBridgeAddress);
    console.log("lnBridge address:", contract.address);

    let bytesData=[];
    for(let i = 0; i < pendingTxs.length; i++) {
        bytesData = bytesData.concat(web3.utils.hexToBytes((pendingTxs[i])));
    }
    let pendingID = utils.keccak256(bytesData);
    console.log("pendingID", pendingID);
    // let sig = await web3.eth.sign(pendingID, owner.address);
    const withdrawAmount = hEether.utils.parseUnits("1", 8);
    let pendingObj = [];
    for(let i = 0; i < pendingTxs.length; i++) {
        let tx = {owner: accounts[1].address, tx:pendingTxs[i], chainType:1, amount:withdrawAmount}
        pendingObj.push(tx);
    }

    let tx = await contract.setPendingWithdrawTx(pendingID, pendingObj);
    console.log("setPendingWithdrawTx tx", tx.hash)
    await sleep(15000);

    let txs = await contract.getPendingWithdrawTxs();
    console.log("getPendingWithdrawTxs:", txs);

    txs = await contract.getPendingTxsByPendingID(pendingID);
    console.log("getPendingTxsByPendingID:", txs);

}

main();
