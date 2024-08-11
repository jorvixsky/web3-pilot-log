# web3-pilot-log

This project has been developed for the SuperHack 2024. Our objective is to provide a secure, private and blockchain-based logbook for pilots. Read more about what a logbook is [here](https://en.wikipedia.org/wiki/Pilot_logbook). Notice that the information provided in this logbook is AESA based, and it is a simplified version mainly for use for Student Pilots and PPL license holders that do not conduct synthetic or IFR flights. This will be upgraded in the future as it is only needed to set the kind of logbook you need (the columns it should have available)

## Features

Using web3-pilot-log you can register as a pilot or entity, so you can both register your flights securely (by using offchain attestations - applying [EAS](https://attest.org/) - that are uploaded to your own [lighthouse.storage](https://www.lighthouse.storage/) account) Also you can register your pilot license data so that you can share it with your logbook.

By registering as an entity (think of an airline or a [flying club](https://en.wikipedia.org/wiki/Flying_club)) you can access the license data and logbooks of the pilots that authorised you to see their data, always verifiable and signed by the pilot, so equally valid as the currently used paper logbooks - bear in mind no digital version is allowed right now as spreadsheets are not verifiable)

Also, if you are a Student Pilot or other pilot that needs an endorsement (signature) of another pilot for a flight, you can require that by inputting the address of the endorser (say a Flight Instructor) that will be able to sign that entry in your logbook in your behalf, making sure you comply with the endorsement requirements.

## Deployments

Our contracts have been deployed to Optimism Sepolia and Base Sepolia (testnet only as there are improvements to be made before entering production). Check the following Blockscout URLs to see the contracts:

[Optimism Sepolia](https://optimism-sepolia.blockscout.com/address/0x11A9872861C940D880EF82475C233DA2Ff993DF8?tab=contract_code)

[Base Sepolia](https://base-sepolia.blockscout.com/address/0xc3F0373877C5D20Dd48aAA7c782D0C8e14B3cFE2?tab=contract_code)
