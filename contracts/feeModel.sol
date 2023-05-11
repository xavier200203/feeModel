
// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "hardhat/console.sol";


contract feeModel is Initializable{


    address payable _foundationAddress;
    uint256 _foundationRatio;

    address payable _dexAddress;
    uint256 _dexRatio;

    uint256 _ratioMax;
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
        uint256 foundationRatio,
        uint256 ratioMax
    ) public initializer{
        
        _dexAddress = dexAddress;
        _dexRatio = dexRatio;

        _foundationAddress = foundationAddress;
        _foundationRatio = foundationRatio;

        _ratioMax = ratioMax;
        _ownerAddress = msg.sender;
        
    }

    receive() external payable {

        console.log("receive ...%d",msg.value);
        uint256 dexFee;
        uint256 foundationFee;
        
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

    function getDexRatio() public view returns (uint) {
        return _dexRatio;
    }

}





