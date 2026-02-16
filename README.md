# Semester Reading Group Management System

A full-stack web application for managing semester-based reading groups, built with Spring Boot and React.

## Features

- **Admin Portal**: Manage groups, persons, semesters, books, and reading assignments
- **User Portal**: View enrolled semesters, groups, and manage participation records
- **Authentication**: Separate login flows for admin and users with JWT-based auth
- **Database Support**: H2 (development) and MySQL (production)

## Technology Stack

### Backend
- Spring Boot 4.0.2
- Java 21
- Spring Security + JWT
- Spring Data JPA + Hibernate
- MySQL 8 / H2 Database
- Maven

### Frontend
- React 18
- React Router DOM
- Axios
- Vite

## Prerequisites

- Java 21 or higher
- Node.js 16+ and npm
- MySQL 8 (optional, for production)
- Maven 3.x (or use included wrapper)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd sample
```

### 2. Backend Configuration

**Create your own `application.properties` file:**

```bash
cp src/main/resources/application.properties.example src/main/resources/application.properties
```

**Edit `src/main/resources/application.properties`:**

For **H2 Database** (quick start):
- The example file is already configured for H2
- No additional setup needed

For **MySQL** (production):
- Uncomment MySQL configuration lines
- Update database name, username, and password
- Create the database: `CREATE DATABASE myapp;`

**IMPORTANT:** Change the JWT secret key to a secure random string!

```properties
jwt.secret=YOUR_SECURE_RANDOM_STRING_HERE
```

### 3. Run the Backend

```bash
# Using Maven wrapper (recommended)
./mvnw spring-boot:run

# Or using Maven
mvn spring-boot:run
```

Backend runs on: `http://localhost:8080`

### 4. Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Default Credentials

### Admin Login
- **URL**: `http://localhost:5173/login`
- **Username**: admin
- **Password**: password123

### User Login
- **URL**: `http://localhost:5173/user/login`
- **Name**: See initialized users (Alice, Bob, Charlie)
- **Password**: Check DataInitializer.java

## Project Structure

```
sample/
├── src/main/java/com/example/sample/
│   ├── controller/     # REST API endpoints
│   ├── service/        # Business logic
│   ├── repository/     # Data access layer
│   ├── model/          # JPA entities
│   ├── security/       # Security configuration
│   ├── dto/            # Data transfer objects
│   └── init/           # Data initialization
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API service layer
│   │   └── App.jsx     # Main app component
│   └── public/         # Static assets
└── CLAUDE.md           # Complete project documentation
```

## Security Notes

**NEVER commit sensitive information to Git:**
- ✅ `application.properties.example` is tracked (safe defaults)
- ❌ `application.properties` is gitignored (contains secrets)
- ❌ `.env` files are gitignored

**Before deploying to production:**
1. Change default admin credentials
2. Generate a strong JWT secret key
3. Use environment variables for sensitive data
4. Enable HTTPS
5. Configure proper CORS settings
6. Review Spring Security configuration

## API Documentation

See [CLAUDE.md](./CLAUDE.md) for complete API documentation and database schema.

## Development

### Database Console (H2 only)

Access H2 console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (empty)

### Build for Production

```bash
# Backend
./mvnw clean package

# Frontend
cd frontend
npm run build
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

[Your License Here]

## Contact

[Your Contact Information]