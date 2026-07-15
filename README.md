# Team Collaboration Platform

## Overview

The Team Collaboration Platform is a modern full-stack web application that allows teams to collaborate on projects and tasks in real time. The platform is designed for startups, agencies, and small teams to manage work efficiently through task tracking, team communication, and activity monitoring.

---

## Features

### Authentication & Authorization

* User Registration and Login
* JWT Authentication
* Protected Routes
* Role-Based Access Control
* Roles: Admin, Manager, Member

### Team Management

* Create Teams
* Manage Team Members
* Assign Roles to Members
* Team-Based Access Permissions

### Task Management

* Create Tasks
* Assign Tasks to Team Members
* Update Task Status
* Set Priorities and Deadlines
* Deadline Reminder System

### Kanban Board

* Drag and Drop Tasks
* To Do Column
* In Progress Column
* Done Column
* Real-Time Updates

### Dashboard Analytics

* Total Users
* Total Teams
* Total Tasks
* Completed Tasks
* In Progress Tasks
* Pending Tasks
* Visual Charts and Statistics

### Activity Logs

* Track User Activities
* Monitor Task Updates
* Record Team Actions

### Notifications

* Task Assignment Notifications
* Deadline Notifications
* Activity Alerts

### Team Chat

* Real-Time Messaging using Socket.IO
* Team-Specific Chat Rooms
* Message History Storage
* Instant Updates

### API Documentation

* Swagger API Documentation
* Interactive API Testing

---

## Tech Stack

### Frontend

* React.js
* Vite
* Tailwind CSS
* Axios
* React Router DOM
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* JWT Authentication
* Swagger

### Database

* PostgreSQL
* Prisma ORM

---

## Project Structure

```text
Team-Collaboration-Platform
│
├── backend
│   ├── controllers
│   ├── middleware
│   ├── prisma
│   ├── routes
│   ├── jobs
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│
└── README.md
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Rhutuja1901/Team-Collboration-Platform.git
cd Team-Collboration-Platform
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Environment Variables

Create a `.env` file inside the backend folder:

```env
DATABASE_URL=your_postgresql_database_url
JWT_SECRET=your_secret_key
PORT=5001
```

---

## API Documentation

Swagger documentation is available at:

```text
http://localhost:5001/api-docs
```

---

## Future Enhancements

* File Sharing
* Video Meetings
* Email Notifications
* Dark Mode
* Mobile Application
* AI Task Recommendations

---

## Author

**Rutuja Ghadge**

Electronics and Telecommunication Engineer
Full Stack Developer
Savitribai Phule Pune University

---

## License

This project is developed for educational and internship evaluation purposes.
