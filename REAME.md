# High-Performance Node.js API 🚀

A high-performance, concurrent API built with Fastify, Node.js Cluster, Worker Threads (via Piscina), and BullMQ (Redis-compatible with Valkey). Designed for real-world handling of parallel tasks, background jobs, and heavy CPU-bound computations — all without blocking the event loop.

---

## ✨ Key Features

- ⚡ Ultra-fast HTTP server powered by Fastify
- 🧵 CPU-heavy operations executed in Worker Threads (Piscina)
- 📨 Background task queue powered by BullMQ + Valkey (Redis-compatible)
- 🧠 Fully multi-core capable using Node.js Cluster
- 🚀 Designed for maximum throughput using real async queues and thread pools
- ✅ Tested with Node.js v22.14.0
- 🧪 Autocannon performance: +140K req/sec

---

## 📦 Tech Stack

| Layer              | Tech Used                |
| ------------------ | ------------------------ |
| HTTP Server        | Fastify                  |
| Background Jobs    | BullMQ + Valkey          |
| CPU-bound Tasks    | Piscina (Worker Threads) |
| Process Management | Node.js Cluster          |
| Job Worker         | BullMQ consumer          |
| Benchmarking       | Autocannon               |

---

## 🛠️ Getting Started

### 📋 Requirements

- Node.js v22.14.0 ⚠️ (Tested and recommended)
- Docker + Docker Compose
- Yarn

---

### 🚀 Setup & Run

1. Clone the repository

```bash
git clone https://github.com/almirtoledo/high-performance-api.git
cd high-performance-api
```

2. Prepare Redis-compatible volume (Valkey) and environment config

```bash
mkdir -p .docker/valkey && chmod 777 -R .docker/valkey
cp .env.example .env
```

3. Start Valkey (Redis) via Docker Compose

```bash
docker compose up -d
```

4. Install dependencies

```bash
yarn install
```

5. Start the Fastify API server (clustered)

```bash
yarn server
```

6. Start the BullMQ queue worker (job processor)

```bash
yarn queue
```

---

## 🔁 Available Endpoints

### `GET /customers/heavy-sync`

🧵 Processes a CPU-intensive task immediately through a Worker Thread (Piscina thread pool).  
Returns result after completing the calculation.

✔ Recommended for synchronous computations that require result inline.

---

### `GET /customers/heavy-async`

🕒 Offloads the job to BullMQ + Valkey (Redis-compatible) queue.  
Returns fast (queued), and the job will be picked up by the background worker.

✔ Recommended for background jobs where the client doesn’t need the result immediately.

---

## 📈 Benchmark Example (via Autocannon)

### `/customers/heavy-sync`

```bash
yarn autocannon -c 100 -d 30 -p 10 http://localhost:3000/customers/heavy-sync
```

- RPS: ~140,000
- Latency: ~6 ms
- Event-loop remains non-blocked via Worker Threads

### `/customers/heavy-async`

```bash
yarn autocannon -c 250 -d 30 http://localhost:3000/customers/heavy-async
```

- RPS: ~45,000
- Latency: ~5 ms
- Jobs enqueued rapidly, processed in background

---

## 🧠 Architecture Overview

- API runs on all CPU cores via Cluster
- CPU-bound tasks = Worker Threads (via Piscina)
- Async background tasks = Job Queue + Redis (Valkey)
- Background jobs processed by queue workers (separate process)

---

## 👤 Author

Developed with ❤️ by **Almir Toledo**

[GitHub](https://github.com/almirtoledo) · [LinkedIn](https://www.linkedin.com/in/almir-junior-antunes-toledo-654a71230/)

---

## 📝 License

Open-sourced under the [MIT License](LICENSE)
