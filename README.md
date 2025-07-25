# Student Report System

A full-stack web application for managing student marks, analytics, feedback, and admin workflows. Built with React (frontend) and Node.js/Express/MongoDB (backend).

---

## 📄 Pitch Deck
- [Gamma App Docs](https://gamma.app/docs/Student-Report-System-Modern-Academic-Management-for-Schools-gwnx8k2lfa7281n)
Access my pitch desk at https://gamma.app/docs/Student-Report-System-Modern-Academic-Management-for-Schools-gwnx8k2lfa7281n
## Features

### Student Dashboard
- Profile management (update info, password)
- Marks analytics (summary cards, average, best/worst, charts)
- Notifications (new marks, remarks, admin messages)
- Download/export marks (PDF/CSV)
- Remarks & feedback (show remarks, request re-evaluation)
- Dark mode & preferences
- Responsive & accessible UI
- Real-time updates for re-evaluation requests

### Admin Dashboard
- View, approve, reject, and delete students
- Give and edit marks for students (with auto-calculated grades)
- View and manage re-evaluation requests (approve/reject with remarks)
- Notifications for pending students and re-evaluation requests
- Export student data (CSV)
- Responsive and accessible UI

---

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Chart.js, socket.io-client
- **Backend:** Node.js, Express, MongoDB, Mongoose, Socket.IO
- **Auth:** JWT-based authentication
- **CI/CD:** GitHub Actions

---

## Getting Started

### Prerequisites
- Node.js (v20 recommended)
- npm
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/Joelmogz/Student_Report.git
   cd Student_Report
   ```

2. **Install backend dependencies:**
   ```sh
   cd server
   npm install
   ```

3. **Install frontend dependencies:**
   ```sh
   cd ../client
   npm install
   ```

4. **Set up environment variables:**
   - Create a `.env` file in `server` with:
     ```env
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     DEFAULT_ADMIN_EMAIL=admin@example.com
     DEFAULT_ADMIN_PASSWORD=admin1234
     ```

---


## Running Locally

1. **Start the backend:**
   ```sh
   cd server
   npm start
   ```

2. **Start the frontend:**
   ```sh
   cd client
   npm run dev
   ```

- The backend runs on [http://localhost:5000](http://localhost:5000)
- The frontend runs on [http://localhost:5173](http://localhost:5173)

---

## Deployment

- Build the frontend:
  ```sh
  cd client
  npm run build
  ```
- Deploy the backend and serve the frontend static files, or deploy separately (see workflow section).
- Set environment variables in your production environment.

---

## CI/CD

- Automated with GitHub Actions: installs dependencies, builds frontend, and (optionally) runs tests on every push/PR to `main`.
- See `.github/workflows/ci.yml` for details.

---


---

## License

MIT 
