export const contractAddress = "0x0e6f68aa171aaefa6f7bd9ba1ae4d63f7ac2a013";

export const contractABI = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "personId", "type": "bytes32" },
      { "indexed": false, "internalType": "string", "name": "username", "type": "string" }
    ],
    "name": "AddedPerson",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }],
    "name": "addPerson",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "personId", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "voter", "type": "address" }
    ],
    "name": "Voted",
    "type": "event"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }],
    "name": "getPoints",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "string", "name": "_username", "type": "string" }],
    "name": "getVotes",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
    "name": "people",
    "outputs": [
      { "internalType": "uint256", "name": "votes", "type": "uint256" },
      { "internalType": "uint256", "name": "points", "type": "uint256" },
      { "internalType": "string", "name": "username", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const faucetAddress = "0x68e3e0409940b1316ab7f0c2fd0b35509fa0437c";

export const faucetABI = [
  {
    "inputs": [],
    "name": "claim",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "fundFaucet",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
];

export const sitePrivateKey = "0x8b16f8d8ff3ff36011be45d2cda15a139805e0483aa0047be756d099be760d58";