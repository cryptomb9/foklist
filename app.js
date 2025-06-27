import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI } from "./utils.js";
import { db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

let provider;
let signer;
let contract;

const connectBtn = document.getElementById("connectBtn");
const addBtn = document.getElementById("addBtn");

connectBtn.onclick = async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install Wallet");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  const address = await signer.getAddress();
  connectBtn.textContent = `${address.slice(0, 6)}...${address.slice(-4)}`;

  loadLeaderboard();
};

addBtn.onclick = async () => {
  const username = prompt("Enter username:").toLowerCase().trim();
  if (!username) return;
  const xLink = prompt("Enter X (Twitter) username:").trim();
  if (!xLink) return;

  try {
    const tx = await contract.addPerson(username);
    await tx.wait();
    alert("Person added on-chain!");

    // Store X profile in Firebase
    await set(ref(db, "profiles/" + username), {
      x: xLink
    });

  } catch (err) {
    console.error(err);
    alert("Failed to add person. Maybe they already exist?");
  }
};