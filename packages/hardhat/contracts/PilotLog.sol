// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

contract PilotLog {
    enum UserType {
        PILOT,
        SIGNER,
        ENTITY
    }
    struct User {
        string profileCid;
        UserType userType;
    }
    struct UserPermissions {
        mapping(address => bool) profileViewAllowedAddress;
    }
    struct LogbookEntryValidation {
        address logbookOwner;
        string logbookId;
        string entryCid;
        address validator;
        bool isValidated;
    }
    struct Logbook {
        string id;
        string lastEntryCid;
        uint entryValidationCount;
        LogbookEntryValidation[] entryValidation;
    }
    struct UserLogbooksInfo {
        uint closedBooksCount;
        Logbook[] closedBook;
        Logbook openBook;
    }
    mapping(address => User) private userProfiles;
    mapping(address => UserLogbooksInfo) private userLogbooksInfo;
    mapping(address => UserPermissions) private userPermission;


    // errors
    function UserNotRegistered() internal pure returns (string memory) {
        return "User not registered";
    }
    function UserAlreadyRegistered() internal pure returns (string memory) {
        return "User already registered";
    }
    function UserNotPilot() internal pure returns (string memory) {
        return "User not pilot";
    }
    function UserNotPilotNorSigner() internal pure returns (string memory) {
        return "User not pilot nor signer";
    }
    function InfoNotAllowed() internal pure returns (string memory){
        return "User not allowed";
    }
    // modifiers
    modifier onlyRegisteredUser() {
        if (stringsEquals(userProfiles[msg.sender].profileCid, "")) {
            revert(UserNotRegistered());
        }
        _;
    }
    modifier onlyNewUser() {
        if (!stringsEquals(userProfiles[msg.sender].profileCid, "")) {
            revert(UserAlreadyRegistered());
        }
        _;
    }
    modifier onlyPilot() {
        if (userProfiles[msg.sender].userType != UserType.PILOT) {
            revert(UserNotPilot());
        }
        _;
    }
    modifier onlyPilotOrSigner() {
        if (userProfiles[msg.sender].userType != UserType.PILOT &&
            userProfiles[msg.sender].userType != UserType.SIGNER) {
            revert(UserNotPilotNorSigner());
        }
        _;
    }
    modifier onlyAllowedUsers(address owner) {
        if(msg.sender != owner &&
            userPermission[owner].profileViewAllowedAddress[msg.sender] != true
        ){
            revert(InfoNotAllowed());
        }
        _;
    }


    // user management functions
    function registerProfile(string calldata _profileCid, UserType _userType) external onlyNewUser {
        userProfiles[msg.sender].profileCid = _profileCid;
        userProfiles[msg.sender].userType = _userType;
    }

    function getUserProfile(address _user) external view returns (User memory) {
        return userProfiles[_user];
    }

    function promoteToSigner() external onlyRegisteredUser onlyPilot {
        userProfiles[msg.sender].userType = UserType.SIGNER;
    }

    // managing user logbooks and profiles
    function closeCurrentLogbook() external {
        userLogbooksInfo[msg.sender].closedBook[userLogbooksInfo[msg.sender].closedBooksCount] = userLogbooksInfo[msg.sender].openBook;
        userLogbooksInfo[msg.sender].openBook.id = "";
        userLogbooksInfo[msg.sender].openBook.lastEntryCid = "";
        userLogbooksInfo[msg.sender].openBook.entryValidationCount = 0;
    }
    function addEntryToCurrentLogbook(string calldata currentLogbookNewCid) external {
        if(stringsEquals(userLogbooksInfo[msg.sender].openBook.id,"")){
            userLogbooksInfo[msg.sender].openBook.id = currentLogbookNewCid;
        }
        userLogbooksInfo[msg.sender].openBook.lastEntryCid = currentLogbookNewCid;
    }
    function giveLogbookPermission(address newAllowedAddress) external {
        userPermission[newAllowedAddress].profileViewAllowedAddress[msg.sender] = true;
    }
    function revokeLogbookPermission(address revokedAddress) external {
        userPermission[revokedAddress].profileViewAllowedAddress[msg.sender] = false;
    }
    function getLogbooks(address logbookOwner) external view  returns (UserLogbooksInfo memory){
        return userLogbooksInfo[logbookOwner];
    }
    function getProfile(address logbookOwner) external view onlyAllowedUsers(logbookOwner) returns (User memory){
        return userProfiles[logbookOwner];
    }

    // TODO:
    function addEntryWithValidator(string memory currentLogbookNewCid, address validator) external {

    }
    function validateEntry(address logbookOwner, string memory logbookId, string memory validationCid) external {
        
    }
    function getEntriesToValidate() external view returns (LogbookEntryValidation[] memory){

    }
    function getValidatedEntries() external view returns (LogbookEntryValidation[] memory){

    }

    // utils
    function stringsEquals(string memory s1, string memory s2) private pure returns (bool) {
        bytes memory b1 = bytes(s1);
        bytes memory b2 = bytes(s2);
        uint256 l1 = b1.length;
        if (l1 != b2.length) return false;
        for (uint256 i=0; i<l1; i++) {
            if (b1[i] != b2[i]) return false;
        }
        return true;
    }

    // helpers
    function getSenderAddress() external view returns (address) {
        return msg.sender;
    }
}
