# Monad Fok List - Web3 Leaderboard

✅ Fully On-Chain Voting with Wallet Connect  
✅ Firebase for profile data (username, X link)  
✅ Leaderboard based on points, cannot be rigged  

---

## 📦 Project Structure

index.html           → Home page (connect wallet, add to list)  
leaderboard.html     → Leaderboard (view and vote)  
style.css            → Purple gradient theme styling  
app.js               → Main app logic (wallet connect, vote logic)  
utils.js             → Contract address & ABI  
firebase-config.js   → Firebase setup for storing usernames & X links  
ethers.min.js        → Ethers.js library for interacting with the contract  

---

## 🔧 Setup Instructions

1. **Firebase Setup**  
   - Go to https://console.firebase.google.com  
   - Create a project  
   - Enable Realtime Database (Test Mode recommended for development)  
   - Copy your config details into `firebase-config.js`  

2. **Smart Contract**  
   - Deploy the provided Solidity contract on Monad Testnet  
   - Copy your Contract Address and ABI into `utils.js`  

3. **Run the Project**  
   - Open `index.html` in your browser  
   - Connect wallet via MetaMask  
   - Add users to the leaderboard  
   - Vote using on-chain transactions  

---

## 🗳 How Voting Works

- Votes and Points tracked on-chain  
- Users can only be added via a wallet-signed transaction  
- Votes cost gas, preventing abuse  
- Profile details (X link, etc.) stored in Firebase  
- Leaderboard updates based on on-chain data  

---

## ⚠️ Important Notes

- Make sure Firebase rules are set to prevent unauthorized changes  
- Only usernames stored on-chain for simplicity  
- You can later replace Firebase with a more decentralized option if needed  

---

## 📡 Tech Stack

- HTML / CSS / Vanilla JS  
- ethers.js for Web3 interactions  
- Firebase Realtime Database  
- Monad Testnet (EVM Compatible)