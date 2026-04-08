# 🚀 Amistaa Backend API

Backend services for the **Amistaa App** — a real-time social platform supporting chat, audio/video calling, media sharing, and wallet features.

---

## 🧠 Tech Stack

- **Node.js** – Runtime
- **Express.js** – API framework
- **Socket.io** – Real-time communication (chat, calls)
- **MongoDB** – Database
- **Cloudflare R2** – Media storage
- **JWT** – Authentication
- **Redis (optional)** – Caching / queues

---

## 📂 Project Structure
src/
├── admin/ # Admin panel logic
├── config/ # App configurations
├── controllers/ # Business logic
├── jobs/ # Scheduled/background jobs
├── middlewares/ # Auth & request middleware
├── models/ # Database schemas
├── routes/ # API routes
├── serializers/ # Response formatting
├── services/ # Core services
├── sockets/ # Real-time events (chat/call)
├── utils/ # Helper functions
├── validators/ # Request validation
├── workers/ # Background workers
└── app.js # Entry point

---

## ⚙️ Features

- 🔐 User authentication (JWT)
- 💬 Real-time chat system
- 📞 Audio & video calling (Socket-based)
- 📁 Media upload & storage (Cloudflare R2)
- 💰 Wallet system (transactions & balance)
- 🛡️ Secure APIs with middleware validation
- ⚡ Scalable service-based architecture

---

## 🔧 Setup & Installation

### 1. Clone the repository
```bash
git clone https://github.com/amistaa2505/amistaa-backend.git
cd amistaa-backend
