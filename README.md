# 🚀 Team Collaboration Platform

A modern full-stack real-time team collaboration and project management platform that helps teams manage tasks, collaborate through chat, share files, receive notifications, and monitor project progress from a centralized dashboard.

---

## 📌 Project Overview

The Team Collaboration Platform is designed as a lightweight project management system for startups and development teams.

It provides a centralized workspace where users can:

- Create and manage teams
- Assign and track tasks
- Use a Kanban board
- Upload and manage task attachments
- Communicate through team chat
- Add comments to tasks
- Receive real-time notifications
- Monitor project activity
- Search information quickly
- Track team and task progress

The application uses REST APIs for backend communication and Socket.IO for real-time collaboration.

---

## ✨ Features

### 🔐 Authentication

- User registration
- User login
- JWT-based authentication
- Password hashing using bcrypt
- Protected API routes
- Role-based authorization

### 👥 Team Management

- Create teams
- View teams
- Add team members
- View team members
- Delete teams
- Team-based task management

### 📋 Task Management

- Create tasks
- Edit tasks
- Delete tasks
- Assign tasks to users
- Set task priority
- Set deadlines
- Update task status
- Task status tracking

### 📊 Kanban Board

Tasks can be organized into:

- TODO
- IN_PROGRESS
- DONE

The Kanban board provides a visual representation of task progress.

### 📎 File Attachments

Users can:

- Select files
- Upload files
- View uploaded attachments
- Delete attachments
- Persist attachments in the database
- Access uploaded files through the backend

### 💬 Team Chat

Real-time team communication using Socket.IO.

Features include:

- Team-based chat rooms
- Real-time messages
- Message persistence
- Sender information
- Socket-based communication

### 🔔 Notifications

- Create notifications
- View notifications
- Unread notification count
- Mark notifications as read
- Real-time notification delivery using Socket.IO

### 🟢 Real-Time Presence

Socket.IO is used to track user connections and provide real-time collaboration functionality.

### 🔎 Search

The dashboard navigation includes a search interface for quickly finding relevant information.

### 📈 Dashboard

The dashboard provides an overview of:

- Total teams
- Total tasks
- Task progress
- Project activity
- Collaboration information

### 📚 API Documentation

Swagger API documentation is included for backend endpoints.

Swagger is available at:

```text
/api-docs



🛠️ Technology Stack
Frontend
React.js
Vite
JavaScript
Tailwind CSS
Axios
React Router
React Icons
React Toastify
Socket.IO Client
Backend
Node.js
Express.js
JavaScript
JWT
bcrypt
Socket.IO
Multer
Swagger
Database
PostgreSQL
Prisma ORM
Development Tools
Git
GitHub
VS Code
Postman
pgAdmin
🏗️ Project Architecture
Team-Collaboration-Platform/
│
├── backend/
│   │
│   ├── controllers/
│   │   ├── attachmentController.js
│   │   ├── authController.js
│   │   ├── dashboardController.js
│   │   ├── notificationController.js
│   │   ├── taskController.js
│   │   └── teamController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.js
│   │
│   ├── routes/
│   │   ├── attachmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── notificationRoutes.js
│   │   ├── taskRoutes.js
│   │   └── teamRoutes.js
│   │
│   ├── socket/
│   │   └── presence.js
│   │
│   ├── uploads/
│   │
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── server.js
│   └── swagger.js
│
├── frontend/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
🗄️ Database Design

The application uses PostgreSQL with Prisma ORM.

Main database models include:

User
Team
TeamMember
Task
Comment
Attachment
Notification
Message
ActivityLog
ChatMessage
Relationships
User
 │
 ├── TeamMember
 │       │
 │       └── Team
 │
 ├── Task
 │
 ├── Comment
 │
 ├── Notification
 │
 └── ChatMessage


Team
 │
 ├── TeamMember
 ├── Task
 ├── Message
 └── ChatMessage


Task
 │
 ├── Comment
 └── Attachment
🔄 Real-Time Architecture

Socket.IO is used for real-time communication.

The application supports events such as:

joinUser
joinTeam
leaveTeam
newNotification
attachmentUploaded
teamCreated
teamDeleted
memberAdded

This allows users to receive updates without manually refreshing the page.

🔐 Authentication Flow

The authentication process works as follows:

User
 │
 ▼
Login
 │
 ▼
Backend
 │
 ├── Find user
 ├── Verify password
 └── Generate JWT
 │
 ▼
JWT Token
 │
 ▼
Frontend
 │
 ▼
Protected API Requests
 │
 ▼
verifyToken Middleware
 │
 ▼
Controller

JWT tokens are used to protect authenticated routes.

📎 Attachment Flow
User selects file
       │
       ▼
Frontend
       │
       ▼
Multipart/Form Data
       │
       ▼
Express + Multer
       │
       ├── Save physical file
       │
       └── Store attachment information
              │
              ▼
          PostgreSQL

Attachment information includes:

File name
File URL
Task ID
Creation date

🚀 Installation
1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>

Move into the project:

cd Team-Collaboration-Platform
⚙️ Backend Setup

Move into backend:

cd backend

Install dependencies:

npm install

Create a .env file:

DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_secret_key
PORT=5001

Generate Prisma Client:

npx prisma generate

Run database migrations:

npx prisma migrate dev

Start backend:

npm run dev

Backend will run on:

http://localhost:5001
💻 Frontend Setup

Open another terminal.

Move to frontend:

cd frontend

Install dependencies:

npm install

Create:

frontend/.env

Add:

VITE_API_URL=http://localhost:5001/api

Start frontend:

npm run dev

Frontend will run on:

http://localhost:5173
📚 Swagger API Documentation

After starting the backend, open:

http://localhost:5001/api-docs

Swagger provides interactive API documentation for testing backend endpoints.

🧪 API Testing

Backend APIs can also be tested using Postman.

Main API groups include:

/api/auth
/api/teams
/api/tasks
/api/attachments
/api/notifications
/api/activities
/api/users
/api/comments
/api/dashboard
/api/chat
🔒 Security

The project includes:

JWT authentication
Password hashing using bcrypt
Protected API routes
Role-based access control
Environment variables for secrets
CORS configuration
File upload validation

Sensitive environment variables are excluded from Git using .gitignore.

📱 User Interface

The application includes:

Login page
Dashboard
Teams page
Tasks page
Kanban board
Team chat
Notifications
Search
User profile information
Responsive navigation
🎯 Project Objective

The objective of this project is to build a scalable real-time collaboration platform that demonstrates practical implementation of:

Full-stack development
REST API development
Database design
Authentication
Authorization
Real-time communication
File management
Modern frontend development
API documentation
Software architecture
Version control
📈 Future Enhancements

Possible future improvements include:

Direct messaging between users
Email notifications
Advanced analytics
Calendar integration
Task drag-and-drop improvements
File preview
Activity timeline
User profile pictures
Advanced search and filtering
Dark mode
Cloud file storage
Automated testing
CI/CD pipeline
👩‍💻 Developer

Rutuja Ghadge

Electronics & Telecommunication Engineering Graduate

Interested in:

Full-Stack Development
React.js
Node.js
PostgreSQL
Software Engineering
Real-Time Applications
⭐ Project Highlights

This project demonstrates practical experience with:

React
Node.js
Express
PostgreSQL
Prisma
JWT
Socket.IO
Tailwind CSS
REST APIs
Swagger
Git
GitHub
📄 License

This project is developed for educational, internship, and portfolio purposes.







