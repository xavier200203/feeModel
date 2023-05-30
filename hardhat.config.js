require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-waffle')
require("@nomiclabs/hardhat-web3")
require('hardhat-deploy')

require('@nomiclabs/hardhat-ethers');
require('@openzeppelin/hardhat-upgrades');

module.exports = {
  networks: {
    testnet: {
        url: `https://api-testnet.elastos.io/esc`,
        accounts: [
          "0x9aede013637152836b14b423dabef30c9b880ea550dbec132183ace7ca6177ed",
          "0x54e6e01600b66af71b9827429ff32599383d7694684bc09e26c3b13d95980650",
          "0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0"
        ]
    },
    local: {
      url: `http://127.0.0.1:6111`,
      accounts: [
          "0x9aede013637152836b14b423dabef30c9b880ea550dbec132183ace7ca6177ed"
        ]
    },

    hardhat: {
      chainId:100,
      gas:202450000,
      blockGasLimit:300_000_000,
      accounts: [
        {privateKey:"0x9aede013637152836b14b423dabef30c9b880ea550dbec132183ace7ca6177ed",balance:"10000000000000000000000"},
        {privateKey:"0x58a6ea95c61cea23a426935067fe276674978be0f12aeaae72faa84ecf893cb8",balance:"10000000000000000000000"},
        {privateKey:"0xcb93f47f4ae6e2ee722517f3a2d3e7f55a5074f430c9860bcfe1d6d172492ed0",balance:"0"},
        {privateKey:"0xa16542516a3e32598cc2f5ce6a11977fc5b267d8c44d001bd721da67ad317d5c",balance:"0"},
      ]
    }
  },
  solidity: '0.6.12',
  namedAccounts: {
    deployer: 0
  },
}
