import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI, faucetAddress, faucetABI, sitePrivateKey } from "./utils.js";
import { db } from "./firebase-config.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

let provider = new ethers.providers.JsonRpcProvider("https://monad-testnet.drpc.org");
let siteWallet = new ethers.Wallet(sitePrivateKey, provider);
let userWallet;
let contract = new ethers.Contract(contractAddress, contractABI, provider);
let faucetContract = new ethers.Contract(faucetAddress, faucetABI, siteWallet);

const startBtn = document.getElementById("connectBtn");
const addBtn = document.getElementById("addBtn");
const formModal = document.getElementById("formModal");
const usernameInput = document.getElementById("usernameInput");
const xInput = document.getElementById("xInput");
const submitBtn = document.getElementById("submitBtn");
const cancelBtn = document.getElementById("cancelBtn");
const faucetBtn = document.getElementById("faucetBtn");

const addressDisplay = document.getElementById("addressDisplay");
const copyBtn = document.getElementById("copyBtn");
const balanceDisplay = document.getElementById("balanceDisplay");

startBtn.onclick = async () => {
  let storedPk = localStorage.getItem("userPk");

  if (!storedPk) {
    const wallet = ethers.Wallet.createRandom();
    storedPk = wallet.privateKey;
    localStorage.setItem("userPk", storedPk);
    await fundNewWallet(wallet.address);
  }

  userWallet = new ethers.Wallet(storedPk, provider);
  displayWallet();
  checkBalance();
};

async function fundNewWallet(address) {
  try {
    const tx = await siteWallet.sendTransaction({
      to: address,
      value: ethers.utils.parseEther("0.5")
    });
    await tx.wait();
  } catch (err) {
    console.error("Funding failed:", err);
  }
}

function displayWallet() {
  const shortAddr = `${userWallet.address.slice(0, 6)}...${userWallet.address.slice(-4)}`;
  startBtn.textContent = shortAddr;
  addressDisplay.textContent = `Address: ${shortAddr}`;
}

async function checkBalance() {
  const bal = await provider.getBalance(userWallet.address);
  const ethBal = ethers.utils.formatEther(bal);
  balanceDisplay.textContent = `Balance: ${parseFloat(ethBal).toFixed(4)} MONAD`;
  if (bal.lte(ethers.utils.parseEther("0.1"))) {
    alert("Balance low. Claim from faucet.");
  }
}

copyBtn.onclick = () => {
  navigator.clipboard.writeText(userWallet.address)
    .then(() => alert("Address copied!"))
    .catch(() => alert("Failed to copy."));
};

faucetBtn.onclick = async () => {
  try {
    const userWithSigner = faucetContract.connect(userWallet);
    const tx = await userWithSigner.claim();
    await tx.wait();
    alert("Faucet claimed!");
    checkBalance();
  } catch (err) {
    console.error(err);
    alert("Faucet claim failed: " + (err.data?.message || err.message));
  }
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
    alert("Fill both fields.");
    return;
  }

  try {
    const userWithSigner = contract.connect(userWallet);
    const tx = await userWithSigner.addPerson(username);
    alert("Txn sent! Username added (pending confirmation)");
    
    await set(ref(db, "profiles/" + username), { x: xLink });
    formModal.classList.add("hidden");
    usernameInput.value = "";
    xInput.value = "";
  } catch (err) {
    console.error(err);
    alert("Failed to add: " + (err.data?.message || err.message));
  }
};