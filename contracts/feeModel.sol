
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "hardhat/console.sol";


contract feeModel is Initializable{

    address payable _minterAddress;
    uint256 _minterRatio;

    address payable _foundationAddress;
    uint256 _foundationRatio;

    address payable _dexAddress;
    uint256 _dexRatio;

    uint256 _ratioMax;
    address private _adminAddress;

    using SafeMath for uint;

    /**
     * @dev onlyAdmin modifier for only admin
     */
    modifier onlyAdmin() {
        require(_adminAddress == msg.sender, "only owner can do the task");
        _;
    }


    /**
     * @dev __FeeModel_init
     */
    function __FeeModel_init(
        address payable minterAddress,
        uint256 minterRatio,
        address payable dexAddress,
        uint256 dexRatio,
        address payable foundationAddress,
        uint256 foundationRatio,
        uint256 ratioMax
    ) public initializer{
          

        _minterAddress = minterAddress;
        _minterRatio = minterRatio;

        _dexAddress = dexAddress;
        _dexRatio = dexRatio;

        _foundationAddress = foundationAddress;
        _foundationRatio = foundationRatio;

        _ratioMax = ratioMax;
        _adminAddress = msg.sender;
        
    }



    receive() external payable {

        console.log("receive ...%d",msg.value);
        uint256 minterFee;
        uint256 dexFee;
        uint256 foundationFee;

        minterFee = msg.value.mul(_minterRatio).div(_ratioMax);
        sendViaCall(_minterAddress,minterFee);
        
        dexFee = msg.value.mul(_dexRatio).div(_ratioMax);
        sendViaCall(_dexAddress,dexFee);

        foundationFee = msg.value.mul(_foundationRatio).div(_ratioMax);
        sendViaCall(_foundationAddress,foundationFee);

    }

    function sendViaCall(address payable to,uint256 value) public payable {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool _sent, bytes memory _data) = to.call{value: value}("");
        require(_sent, "Failed to send Coin");
    }


    // Fallback function is called when msg.data is not empty
    fallback() external payable {

        console.log("fallback ...");

    }

    function getAllBalances() public view returns (uint,uint,uint) {
        return (_minterAddress.balance,_foundationAddress.balance,_dexAddress.balance);
    }



}





