# TaskHub - Project & Bounty Management System

A full-stack web application for managing projects, tasks, and bounties with Admin and User roles.

## Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose)
- **Authentication**: JWT-based auth

## Features

- **User Roles**: Admin and User (default pending approval).
- **Authentication**: Signup, Login, Admin Approval System.
- **Projects**: Admins create projects and assign users.
- **Tasks**: Admins add tasks (Tweets/Other). Users submit work (Tweet Links).
- **Bounties**: Time-limited rewards managed by Admins.
- **Submissions**: Admin review system for user submissions.

## Setup Instructions

### Prerequisites

- Node.js (v14+)
- MongoDB (Local or Atlas)

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file based on `.env.example`:
    ```bash
    cp .env.example .env
    ```
    _Update `MONGODB_URI` and `JWT_SECRET` if needed._
4.  Start the server:
    ```bash
    npm run dev
    ```
    _Server runs on http://localhost:5000_

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    _App runs on http://localhost:5173_

## Usage Guide

1.  **Sign Up**: Create a new account. You will see a "Pending Approval" message.
2.  **Admin Access**:
    - You need to manually set a user's role to `admin` and status to `approved` in the database to get your first admin.
    - Or use a seed script (not included, but easy to add).
3.  **Admin Panel**:
    - Approve pending users.
    - Create Projects and assign approved users.
    - Add Tasks to projects.
    - Create Bounties.
4.  **User Dashboard**:
    - View assigned projects.
    - Submit tasks (paste tweet link).
    - View active bounties.

## API Endpoints

- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/admin/users` - List users
- `POST /api/admin/projects` - Create project
- `GET /api/user/projects` - Get assigned projects
- ...and more.

## License

MIT
