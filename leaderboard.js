import { ethers } from "https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.esm.min.js";
import { contractAddress, contractABI } from "./utils.js";
import { db } from "./firebase-config.js";
import { ref, get, child } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

let provider;
let signer;
let contract;

const leaderboardEl = document.getElementById("leaderboard");
const searchInput = document.getElementById("searchInput");

window.addEventListener("load", async () => {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask or a compatible wallet");
    return;
  }
  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();
  contract = new ethers.Contract(contractAddress, contractABI, signer);

  loadLeaderboard();

  searchInput.addEventListener("input", filterLeaderboard);
});

async function loadLeaderboard() {
  leaderboardEl.innerHTML = "Loading...";

  const usernames = await fetchAllUsernames();
  leaderboardEl.innerHTML = "";

  const promises = usernames.map(async (username, index) => {
    const [votes, points] = await Promise.all([
      contract.getVotes(username),
      contract.getPoints(username),
    ]);

    const xSnapshot = await get(child(ref(db), "profiles/" + username));
    const xLink = xSnapshot.exists() ? xSnapshot.val().x : "unknown";

    return {
      username,
      votes: votes.toString(),
      points: points.toString(),
      xLink,
      position: index + 1,
    };
  });

  const leaderboardData = await Promise.all(promises);

  leaderboardData.forEach(data => {
    const row = document.createElement("div");
    row.className = "leaderboard-item";
    row.innerHTML = `
      <span class="position">${data.position}</span>
      <img src="https://unavatar.io/twitter/${data.xLink}" class="pfp">
      <span class="username">${data.username}</span>
      <span>🖕🏿 ${data.votes}</span>
      <span>⭐ ${data.points}</span>
      <a href="https://x.com/${data.xLink}" target="_blank">View X</a>
      <button class="vote-btn">Vote</button>
    `;

    row.querySelector(".vote-btn").onclick = async () => {
      try {
        const tx = await contract.vote(data.username);
        await tx.wait();
        alert("Voted!");
        loadLeaderboard();
      } catch (err) {
        console.error(err);
        alert("Failed to vote");
      }
    };

    leaderboardEl.appendChild(row);
  });
}

function filterLeaderboard() {
  const filter = searchInput.value.toLowerCase().trim();
  const items = document.querySelectorAll(".leaderboard-item");

  items.forEach(item => {
    const username = item.querySelector(".username").textContent.toLowerCase();
    if (username.includes(filter)) {
      item.style.display = "flex";
    } else {
      item.style.display = "none";
    }
  });
}

async function fetchAllUsernames() {
  const snapshot = await get(child(ref(db), "profiles"));
  if (!snapshot.exists()) return [];
  return Object.keys(snapshot.val());
}