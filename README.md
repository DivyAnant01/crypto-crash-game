# 💥 Crypto Crash Game Backend (Full Project)

A complete backend system for an online **Crypto Crash game** built using **Node.js**, **Express**, **MongoDB**, and **WebSockets**. Players place bets in USD, which are converted to crypto (BTC/ETH) using real-time prices fetched from **CoinGecko API**. Players cash out before the game crashes!

---

## 📦 Technologies Used

| Tool/Library      | Purpose                              |
|-------------------|--------------------------------------|
| Node.js           | Backend JavaScript runtime           |
| Express.js        | REST API framework                   |
| MongoDB + Mongoose| NoSQL database & ODM                 |
| Socket.IO         | Real-time WebSocket communication    |
| CoinGecko API     | Real-time crypto prices (BTC/ETH)    |
| Axios             | API requests                         |
| dotenv            | Environment variable management      |
| uuid              | Unique ID generation                 |
| nodemon (dev)     | Auto server restart during dev       |

---

## 🧰 What to Install (Step-by-Step)

### 1️⃣ Software Installation (Mandatory)

| Software          | Download Link                                 |
|-------------------|------------------------------------------------|
| **Node.js (LTS)** | https://nodejs.org                             |
| **MongoDB**       | https://www.mongodb.com/try/download/community|
| **MongoDB Compass**| https://www.mongodb.com/try/download/compass |
| **VS Code**       | https://code.visualstudio.com                  |
| **Postman**       | https://www.postman.com/downloads/             |
| **Git**           | https://git-scm.com/downloads                  |

---

## 🚀 Project Setup (Step-by-Step)

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd crypto-crash-game


2. Initialize Project and Install Dependencies
npm install

3. Create Environment File .env
Create a .env file in the root folder:
PORT=5000
MONGO_URI=mongodb://localhost:27017/cryptoCrashDB

4. Run MongoDB Locally
Start MongoDB server (command line or via MongoDB Compass GUI):
mongod


5. Run the Project in Development Mode
npx nodemon server.js

Run this script to add test players:
npm run add-players

