# 🏛️ EstateFlow Premium

> **Redefining Real Estate Management**  
> EstateFlow is a high-performance, full-stack real estate application crafted for luxury property listings, elegant user experiences, and millisecond-level data speeds.

![EstateFlow Stack](https://img.shields.io/badge/Stack-React%20%7C%20FastAPI%20%7C%20Redis%20%7C%20Supabase-2D3748?style=for-the-badge&logo=react)
![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

---

## ✨ Features

- **💎 Premium Design System:** Custom-built Vanilla CSS architecture enforcing a unified "Earthy & Grounded" color palette combined with modern glassmorphism UI components.
- **⚡ Sub-Millisecond Speed:** Powered by a robust Python FastAPI backend, integrated directly with an asynchronous Redis caching layer (Cache-Aside pattern) to serve property listings instantly.
- **🛡️ Ironclad Security:** End-to-end integration with Supabase Auth, combined with local high-performance JWT validation and Role-Based Access Controls (RBAC) via Python-Jose.
- **📊 Real-time Dashboard:** An intelligent partner portal allowing certified agents to seamlessly publish, update, and manage exclusive real estate listings.

---

## 🏗️ Technology Stack

### Frontend (User Interface)
* **Framework:** React 18 (Bootstrapped via Vite for HMR and build speeds)
* **Routing:** React-Router-Dom (Client-side dynamic routing)
* **State Management:** Custom Global React AuthContext mapping Supabase sessions
* **Styling:** Custom "Vanilla-Glass" Engine (No bloated frameworks)
* **Icons:** Lucide-React

### Backend (API & Data)
* **Framework:** FastAPI (Python)
* **Database:** PostgreSQL (via Supabase)
* **Cache:** Redis Cloud (Async Connection Pooling)
* **ORMs & Validation:** Pydantic Models for strict type enforcement
* **Auth:** Supabase Auth + Local JWT Verification

---

## 🚀 Quick Start Guide

Want to run EstateFlow securely on your local machine?

### 1. Database Configuration
You need active Supabase and Redis Cloud endpoints. Populate the `backend/.env` and `frontend/.env` variables with your specific URL and API Keys.

### 2. Ignite the Backend
Initialize your Python environment and start the ultra-fast Uvicorn server:
```bash
cd backend
python -m venv venv
source venv/Scripts/activate  # (or venv\Scripts\activate on Windows CMD)
pip install -r requirements.txt
uvicorn app.main:app --reload
```
*Your interactive Swagger API Docs will be live at `http://localhost:8000/docs`*

### 3. Launch the Frontend
In a new terminal window, spin up the Vite-powered React system:
```bash
cd frontend
npm install
npm run dev
```
*Your luxury web application will be live at `http://localhost:5173/`*

---

<p align="center">
  <i>Developed for those who expect <b>more</b> from their digital properties.</i>
</p>
