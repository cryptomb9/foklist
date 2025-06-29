import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI } from "./utils.js";
import { db } from "./firebase-config.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

let provider = new ethers.providers.JsonRpcProvider("https://monad-testnet.drpc.org");
let userWallet = null;
let contract = new ethers.Contract(contractAddress, contractABI, provider);

let leaderboardData = [];

const leaderboardEl = document.getElementById("leaderboard");
const searchInput = document.getElementById("searchInput");

window.addEventListener("load", async () => {
  const storedPk = localStorage.getItem("userPk");
  if (!storedPk) {
    alert("No wallet found. Please go to home page and click Start first.");
    return;
  }

  userWallet = new ethers.Wallet(storedPk, provider);
  contract = contract.connect(userWallet);

  await loadLeaderboard();
  searchInput.addEventListener("input", filterLeaderboard);
});

async function loadLeaderboard() {
  leaderboardEl.innerHTML = "Loading...";

  const usernames = await fetchAllUsernames();
  const promises = usernames.map(async (username) => {
    const [votes, points] = await Promise.all([
      contract.getVotes(username),
      contract.getPoints(username),
    ]);

    const xSnapshot = await get(child(ref(db), "profiles/" + username));
    const xLink = xSnapshot.exists() ? xSnapshot.val().x : "unknown";

    return {
      username,
      votes: parseInt(votes.toString()),
      points: parseInt(points.toString()),
      xLink,
    };
  });

  leaderboardData = await Promise.all(promises);
  renderLeaderboard();
}

function renderLeaderboard() {
  leaderboardData.sort((a, b) => b.votes - a.votes);

  leaderboardEl.innerHTML = "";
  leaderboardData.forEach((data, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-item";
    row.setAttribute("data-username", data.username);

    row.innerHTML = `
      <span class="position">${index + 1}</span>
      <img src="https://unavatar.io/twitter/${data.xLink}" class="pfp">
      <span class="username">${data.username}</span>
      <span class="votes">🖕🏿 ${data.votes}</span>
      <span class="points">⭐ ${data.points}</span>
      <a href="https://x.com/${data.xLink}" target="_blank">View X</a>
      <button class="vote-btn">Vote</button>
    `;

    row.querySelector(".vote-btn").onclick = () => voteForUser(data.username);
    leaderboardEl.appendChild(row);
  });
}

async function voteForUser(username) {
  try {
    const tx = await contract.vote(username);
    alert(`Vote txn sent!\nHash: ${tx.hash}`);
    await tx.wait();
    alert("Vote confirmed!");

    await updateUserRow(username);
  } catch (err) {
    console.error(err);
    alert("Failed to vote: " + (err.data?.message || err.message));
  }
}

async function updateUserRow(username) {
  const [votes, points] = await Promise.all([
    contract.getVotes(username),
    contract.getPoints(username),
  ]);

  const index = leaderboardData.findIndex(u => u.username === username);
  if (index === -1) return;

  leaderboardData[index].votes = parseInt(votes.toString());
  leaderboardData[index].points = parseInt(points.toString());

  renderLeaderboard();
}

function filterLeaderboard() {
  const filter = searchInput.value.toLowerCase().trim();
  const items = document.querySelectorAll(".leaderboard-item");

  items.forEach(item => {
    const username = item.querySelector(".username").textContent.toLowerCase();
    item.style.display = username.includes(filter) ? "flex" : "none";
  });
}

async function fetchAllUsernames() {
  const snapshot = await get(child(ref(db), "profiles"));
  if (!snapshot.exists()) return [];
  return Object.keys(snapshot.val());
}