
// SPDX-License-Identifier: MIT
pragma solidity ^0.7.6;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "hardhat/console.sol";


contract feeModel is Initializable{


    address payable _foundationAddress;
    uint256 _foundationRatio;

    address payable _dexAddress;
    uint256 _dexRatio;

    address private _ownerAddress;

    using SafeMath for uint;

    /**
     * @dev onlyOwner modifier for only admin
     */
    modifier onlyOwner() {
        require(_ownerAddress == msg.sender, "only owner can do the task");
        _;
    }

    modifier onlyFoundation() {
        require(_foundationAddress == msg.sender, "only foundation can do the task");
        _;
    }

    modifier onlyDex() {
        require(_dexAddress == msg.sender, "only dex can do the task");
        _;
    }

    /**
     * @dev __FeeModel_init
     */
    function __FeeModel_init(
        address payable dexAddress,
        uint256 dexRatio,
        address payable foundationAddress,
        uint256 foundationRatio
    ) public initializer{
        _dexAddress = dexAddress;
        _foundationAddress = foundationAddress;
        _ownerAddress = msg.sender;
        changeRatio(dexRatio, foundationRatio);
    }

    receive() external payable {
//        revert("don't send value");
    }

    function divideMoney() external{
        uint256 dexFee;
        uint256 foundationFee;
        uint totalPercent = 100;
        uint balance = address(this).balance;

        dexFee = balance.mul(_dexRatio).div(totalPercent);
        sendViaCall(_dexAddress,dexFee);

        foundationFee = balance.mul(_foundationRatio).div(totalPercent);
        sendViaCall(_foundationAddress,foundationFee);
    }

    function sendViaCall(address payable to,uint256 value) private {
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool _sent, ) = to.call{value: value}("");
        require(_sent, "Failed to send Coin");
    }


    // Fallback function is called when msg.data is not empty
    fallback() external payable {

        console.log("fallback ...");

    }

    function changeOwner(address newOwnerAddress) public onlyOwner{
        _ownerAddress = newOwnerAddress;
    }

    function changeFoundation(address payable newFoundationAddress) public onlyFoundation{
        _foundationAddress = newFoundationAddress;
    }

    function changeDex(address payable newDexAddress) public onlyDex{
        _dexAddress = newDexAddress;
    }

    function changeRatio(
        uint256 dexRatio,
        uint256 foundationRatio
    ) public onlyOwner{
         require(dexRatio.add(foundationRatio) == 100, "invalidRatio");
        _dexRatio = dexRatio;
        _foundationRatio = foundationRatio;
    }

    function getAllBalances() public view returns (uint,uint) {
        return (_dexAddress.balance,_foundationAddress.balance);
    }

    function getOwnerAddress() public view returns (address) {
        return _ownerAddress;
    }

    function getFoundationAddress() public view returns (address) {
        return _foundationAddress;
    }

    function getFoundationRatio() public view returns (uint) {
        return _foundationRatio;
    }

    function getDexAddress() public view returns (address) {
        return _dexAddress;
    }
}





