import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI } from "./utils.js";
import { db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

let provider;
let signer;
let contract;

const connectBtn = document.getElementById("connectBtn");
const addBtn = document.getElementById("addBtn");
const formModal = document.getElementById("formModal");
const usernameInput = document.getElementById("usernameInput");
const xInput = document.getElementById("xInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");

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
};

addBtn.onclick = () => {
  formModal.classList.remove("hidden");
};

cancelBtn.onclick = () => {
  formModal.classList.add("hidden");
  usernameInput.value = "";
  xInput.value = "";
};

submitBtn.onclick = async () => {
  const username = usernameInput.value.toLowerCase().trim();
  const xLink = xInput.value.trim();

  if (!username || !xLink) {
    alert("Please fill in both fields.");
    return;
  }

  try {
    const tx = await contract.addPerson(username);
    await tx.wait();
    alert("Person added on-chain!");

    await set(ref(db, "profiles/" + username), {
      x: xLink
    });

    formModal.classList.add("hidden");
    usernameInput.value = "";
    xInput.value = "";

  } catch (err) {
    console.error(err);
    alert("Failed to add person:\n" + (err.data?.message || err.message));
  }
};