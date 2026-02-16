# Admin Frontend - React Application

This is the React frontend for the Semester Reading Group Management System admin interface.

## Prerequisites

- Node.js 18+ and npm

## Installation

```bash
cd frontend
npm install
```

## Running the Application

1. **Start the Spring Boot backend first** (on port 8080):
   ```bash
   cd ..
   ./mvnw spring-boot:run
   ```

2. **In a new terminal, start the React frontend** (on port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:3000
   ```

## First Time Setup

1. **Register an admin account** using the API:
   ```bash
   curl -X POST http://localhost:8080/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"username":"admin","name":"Admin User","password":"password123"}'
   ```

2. **Login** with the credentials:
   - Username: `admin`
   - Password: `password123`

## Features

- **Login Page**: Secure authentication with JWT tokens
- **Dashboard**: Overview of all management features
- **Protected Routes**: Automatic redirect if not authenticated
- **Auto-logout**: Redirects to login on 401 errors

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # Login page component
│   │   ├── Login.css          # Login page styles
│   │   ├── Dashboard.jsx      # Dashboard component
│   │   ├── Dashboard.css      # Dashboard styles
│   │   └── PrivateRoute.jsx   # Route protection
│   ├── services/
│   │   ├── authService.js     # Authentication API calls
│   │   └── apiService.js      # Axios instance with JWT
│   ├── App.jsx                # Main app with routing
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── package.json               # Dependencies
├── vite.config.js             # Vite configuration
└── index.html                 # HTML template
```

## API Integration

The frontend communicates with the Spring Boot backend via:

- **Base URL**: `http://localhost:8080/api`
- **Authentication**: JWT tokens stored in localStorage
- **Auto-refresh**: Tokens included in all authenticated requests

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Technologies Used

- **React 18** - UI library
- **React Router 6** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool and dev server