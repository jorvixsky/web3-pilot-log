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
    mapping(address => User) public userProfiles;


    // user management
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
    // functions
    function registerProfile(string calldata _profileCid, UserType _userType) external onlyNewUser {
        // check if user is already registered
        userProfiles[msg.sender] = User({
            profileCid: _profileCid,
            userType: _userType
        });
    }

    function getUserProfile(address _user) external view returns (User memory) {
        return userProfiles[_user];
    }

    function promoteToSigner() external onlyRegisteredUser {
        if (userProfiles[msg.sender].userType != UserType.PILOT) {
            revert(UserNotPilot());
        }
        userProfiles[msg.sender].userType = UserType.SIGNER;
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
}
