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
    struct SignerValidations {
        uint count;
        LogbookEntryValidation[] validations;
    }
    mapping(address => User) private userProfiles;
    mapping(address => UserLogbooksInfo) private userLogbooksInfo;
    mapping(address => UserPermissions) private userPermission;

    mapping(address => SignerValidations) private signerValidations;

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
    function UserNotSigner() internal pure returns (string memory) {
        return "User not signer";
    }
    function UserNotPilotNorSigner() internal pure returns (string memory) {
        return "User not pilot nor signer";
    }
    function InfoNotAllowed() internal pure returns (string memory){
        return "User not allowed";
    }
    function NotSignerForEntry() internal pure returns (string memory){
        return "Is not signer for entry";
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
    modifier onlySigner() {
        if (userProfiles[msg.sender].userType != UserType.SIGNER) {
            revert(UserNotSigner());
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
    function closeCurrentLogbook() external onlyPilotOrSigner() {
        userLogbooksInfo[msg.sender].closedBook.push(userLogbooksInfo[msg.sender].openBook);
        userLogbooksInfo[msg.sender].closedBooksCount = userLogbooksInfo[msg.sender].closedBooksCount + 1;
        userLogbooksInfo[msg.sender].openBook.id = "";
        userLogbooksInfo[msg.sender].openBook.lastEntryCid = "";
        userLogbooksInfo[msg.sender].openBook.entryValidationCount = 0;
        delete userLogbooksInfo[msg.sender].openBook.entryValidation;
    }
    function addEntryToCurrentLogbook(string calldata currentLogbookNewCid) external onlyPilotOrSigner() {
        if(stringsEquals(userLogbooksInfo[msg.sender].openBook.id,"")){
            userLogbooksInfo[msg.sender].openBook.id = currentLogbookNewCid;
        }
        userLogbooksInfo[msg.sender].openBook.lastEntryCid = currentLogbookNewCid;
    }
    function giveLogbookPermission(address newAllowedAddress) external onlyPilotOrSigner(){
        userPermission[msg.sender].profileViewAllowedAddress[newAllowedAddress] = true;
    }
    function revokeLogbookPermission(address revokedAddress) external onlyPilotOrSigner(){
        userPermission[msg.sender].profileViewAllowedAddress[revokedAddress] = false;
    }
    function getLogbooks(address logbookOwner) external view onlyAllowedUsers(logbookOwner) returns (UserLogbooksInfo memory){
        return userLogbooksInfo[logbookOwner];
    }
    function getProfile(address logbookOwner) external view onlyAllowedUsers(logbookOwner) returns (User memory){
        return userProfiles[logbookOwner];
    }

    // TODO:
    function addEntryWithValidator(string memory _currentLogbookNewCid, address _validator) external onlyPilotOrSigner(){
        if(stringsEquals(userLogbooksInfo[msg.sender].openBook.id,"")){
            userLogbooksInfo[msg.sender].openBook.id = _currentLogbookNewCid;
        }
        userLogbooksInfo[msg.sender].openBook.lastEntryCid = _currentLogbookNewCid;

        LogbookEntryValidation memory ev = LogbookEntryValidation(
            msg.sender,
            userLogbooksInfo[msg.sender].openBook.id,
            _currentLogbookNewCid,
            _validator,
            false
        );
        userLogbooksInfo[msg.sender].openBook.entryValidation.push(ev);
        userLogbooksInfo[msg.sender].openBook.entryValidationCount++;
        signerValidations[_validator].validations.push(ev);
        signerValidations[_validator].count++;
    }
    function validateEntry(address _logbookOwner, string memory _logbookId, string memory _validationCid) external onlySigner(){
        bool signed = signEntryValidationOnSignerData(_logbookOwner, _logbookId, _validationCid);
        bool signed2 = signEntryValidationOnBook(_logbookOwner, _logbookId, _validationCid);
        if (!signed || !signed2) {
            revert(NotSignerForEntry());
        }
    }
    function getEntriesToValidate() external view onlySigner() returns (LogbookEntryValidation[] memory) {
        uint i=0;
        uint count  = 0;
        for (i = 0; i != signerValidations[msg.sender].count; i++) {
            LogbookEntryValidation storage ev = signerValidations[msg.sender].validations[i];
            if(!ev.isValidated) {
                count++;
            }     
        }
        LogbookEntryValidation[] memory res = new LogbookEntryValidation[](count);
        uint arrayI = 0;
        for (i = 0; i != signerValidations[msg.sender].count; i++) {
            LogbookEntryValidation storage ev = signerValidations[msg.sender].validations[i];
            if(!ev.isValidated) {
                LogbookEntryValidation memory lv = LogbookEntryValidation(
                    ev.logbookOwner,
                    ev.logbookId,
                    ev.entryCid,
                    ev.validator,
                    ev.isValidated
                );
                res[arrayI] = lv;
                arrayI++;
            }     
        }

        return res;
    }
    function getValidatedEntries() external view onlySigner() returns (LogbookEntryValidation[] memory) {
        uint i=0;
        uint count  = 0;
        for (i = 0; i != signerValidations[msg.sender].count; i++) {
            LogbookEntryValidation storage ev = signerValidations[msg.sender].validations[i];
            if(ev.isValidated) {
                count++;
            }     
        }
        LogbookEntryValidation[] memory res = new LogbookEntryValidation[](count);
        uint arrayI = 0;
        for (i = 0; i != signerValidations[msg.sender].count; i++) {
            LogbookEntryValidation storage ev = signerValidations[msg.sender].validations[i];
            if(ev.isValidated) {
                LogbookEntryValidation memory lv = LogbookEntryValidation(
                    ev.logbookOwner,
                    ev.logbookId,
                    ev.entryCid,
                    ev.validator,
                    ev.isValidated
                );
                res[arrayI] = lv;
                arrayI++;
            }     
        }
        return res;
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

    function signEntryValidationOnSignerData(address _logbookOwner, string memory _logbookId, string memory _validationCid) private returns (bool){
        uint i=0;
        for (i = 0; i < signerValidations[msg.sender].count; i++) {
            LogbookEntryValidation storage ev = signerValidations[msg.sender].validations[i];
            if(ev.logbookOwner == _logbookOwner && stringsEquals(ev.logbookId, _logbookId) && stringsEquals(_validationCid, ev.entryCid)) {
                ev.isValidated = true;
                return true;
            }     
        }
        return false;
    }
    function signEntryValidationOnBook(address _logbookOwner, string memory _logbookId, string memory _validationCid) private returns (bool){
        Logbook storage book;
        if(stringsEquals(userLogbooksInfo[_logbookOwner].openBook.id, _logbookId)){
            book = userLogbooksInfo[_logbookOwner].openBook;
            uint i=0;
            for (i = 0; i != book.entryValidationCount; i++) {
                LogbookEntryValidation storage ev = book.entryValidation[i];
                if(ev.logbookOwner == _logbookOwner && stringsEquals(ev.logbookId, _logbookId) && stringsEquals(_validationCid, ev.entryCid)) {
                    if(msg.sender == ev.validator){
                        ev.isValidated = true;
                        return true;
                    }
                    return false;
                }     
            }
            return false;
        }
        else {
            uint i=0;
            for (i = 0; i != userLogbooksInfo[_logbookOwner].closedBooksCount; i++) {
                if(stringsEquals(userLogbooksInfo[_logbookOwner].closedBook[i].id, _logbookId)){
                    book = userLogbooksInfo[_logbookOwner].closedBook[i];
                    uint j=0;
                    for (j = 0; j != book.entryValidationCount; j++) {
                        LogbookEntryValidation storage ev = book.entryValidation[j];
                        if(ev.logbookOwner == _logbookOwner && stringsEquals(ev.logbookId, _logbookId) && stringsEquals(_validationCid, ev.entryCid)) {
                            if(msg.sender == ev.validator){
                                ev.isValidated = true;
                                return true;
                            }
                            return false;
                        }     
                    }
                    return false;
                }  
            }
        }
        return false;
    }

    // helpers
    function getSenderAddress() external view returns (address) {
        return msg.sender;
    }
}
