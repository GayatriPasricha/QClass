# QClass 🎓

QClass is a high-performance, real-time classroom Q&A platform designed for modern learning environments. Built with the MERN stack and Socket.io, it allows students to ask questions, upvote popular queries, and enables teachers to manage sessions with ease.

![QClass Preview](https://via.placeholder.com/800x450/0f1117/6366f1?text=QClass+-+Real-time+Classroom+Q%26A)

## 🚀 Key Features

- **Real-time Interaction**: Questions appear instantly for everyone via Socket.io.
- **Role-based Dashboards**:
  - **Teachers**: Create classrooms, get unique codes, pin active questions, and mark them as answered.
  - **Students**: Join rooms via code, ask questions anonymously, and upvote classmates' queries.
- **Persistence**: All questions and classroom data are saved in MongoDB Atlas.
- **Modern UI**: Sleek, dark-mode dashboard with glassmorphism and smooth animations using Tailwind CSS v4.
- **Analytics**: Teachers can see live stats on question activity and student participation.

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS v4, Lucide Icons, Socket.io Client.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB (Mongoose ODM).
- **Auth**: JWT (JSON Web Tokens) with Bcrypt hashing.

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd qclass
```

### 2. Backend Setup
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```
Install dependencies:
```bash
npm install
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

## 🏃 Running the Application

You need to run both the backend and frontend simultaneously.

### Start the Backend
From the root directory:
```bash
npm run dev
```

### Start the Frontend
From the `frontend` directory:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📂 Project Structure

```text
├── frontend/             # React application (Vite + Tailwind v4)
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # Auth state management
│   │   ├── pages/        # Dashboard and Live views
│   │   └── utils/        # API and Socket configurations
├── src/                  # Express backend
│   ├── config/           # Database connection
│   ├── middleware/       # JWT and Teacher authorization
│   ├── models/           # Mongoose schemas (User, Classroom, Question)
│   ├── routes/           # API endpoints
│   └── sockets/          # Socket.io event logic
└── server.js             # Main entry point
```

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any features or bug fixes!

---
Developed with ❤️ by the QClass Team.
