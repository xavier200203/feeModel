const fs = require('fs')
const path = require('path')
const { ethers,upgrades } = require("hardhat");
const {existsSync} = require("fs");
const {parseEther} = require("ethers/lib/utils");

const targetChainType = 1;

const writeConfig = async (fromFile,toFile,key, value) => {

    let fromFullFile = getPath(fromFile);
    if (fs.existsSync(fromFullFile) == false) {
        fs.writeFileSync(fromFullFile, "{}", { encoding: 'utf8' }, err => {})
    }

    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    if (contentText == "") {
        contentText = "{}";
    }
    let data = JSON.parse(contentText);
    data[key] = value;

    let toFullFile = getPath(toFile);
    fs.writeFileSync(toFullFile, JSON.stringify(data, null, 4), { encoding: 'utf8' }, err => {})

}

const readConfig = async (fromFile,key) => {

    let fromFullFile = getPath(fromFile);
    let contentText = fs.readFileSync(fromFullFile,'utf-8');
    let data = JSON.parse(contentText);
   
    return data[key];

}

function getPath(fromFile){
    return  path.resolve(__dirname, '../config/' + fromFile + '.json');
}

const log = (msg) => console.log(`${msg}`)

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function deployEBTC(account){
    const ebtcFactory = await ethers.getContractFactory("EBTC",account);
    const ebtc = await ebtcFactory.deploy();
    return ebtc;
}

async function attachEBTC(account,address) {
    const ebtcFactory = await ethers.getContractFactory("EBTC",account);
    const ebtc = await ebtcFactory.attach(
        address
    )
    return ebtc;
}

async function deployLNBridge(account,args) {
    const Factory_lnBridge = await ethers.getContractFactory('LNBridge',account)
    const lnBridge = await upgrades.deployProxy(
        Factory_lnBridge,
        [args.submitters],
        { initializer: '_init_' }
    );
    return lnBridge;
}

async function attachLNBridge(account, address) {
    const Factory_lnBridge = await ethers.getContractFactory('LNBridge',account)
    let lnBridge  = await Factory_lnBridge.connect(account).attach(address);
    return lnBridge;

}

async function deployERC20Handler(account,args) {
    const Factory__Erc20Handler = await ethers.getContractFactory('ERC20Handler',account)
    const Erc20Handler = await upgrades.deployProxy(
        Factory__Erc20Handler,
        [args.bridgeAddress],
    { initializer: 'init' },
    );
    console.log("✓ ERC20Handler contract deployed")
    return Erc20Handler;
}

module.exports = {
    writeConfig,
    readConfig, 
    sleep,
    log,

    deployEBTC,
    deployLNBridge,
    deployERC20Handler,
    attachEBTC,
    attachLNBridge,
    targetChainType,
}