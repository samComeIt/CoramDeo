# User Flow Setup Complete

## Overview
A complete user-facing frontend has been created for the Semester Reading Group Management System. Users can now log in, view their semesters and groups, and update their participation records.

## Backend Changes

### 1. New Controller: `UserController.java`
**Location:** `src/main/java/com/example/sample/controller/UserController.java`

**Endpoints:**
- `POST /api/user/login` - User authentication
- `GET /api/user/{personId}/semesters` - Get user's semesters and groups
- `GET /api/user/{personId}/participations` - Get user's participations (filterable by semester/group)
- `PUT /api/user/participations/{participationId}/record` - Update weekly record

### 2. Updated PersonService
**Location:** `src/main/java/com/example/sample/service/PersonService.java`

**New Methods:**
- `authenticate(String name, String password)` - Authenticate user
- `findByName(String name)` - Find person by name

### 3. Updated SecurityConfig
**Location:** `src/main/java/com/example/sample/security/SecurityConfig.java`

**Changes:**
- Added `/api/user/login` to permitted endpoints (no authentication required)
- User endpoints require authentication after login

## Frontend Changes

### 1. New Services

#### `userAuthService.js`
Handles user authentication:
- `login(name, password)` - User login
- `logout()` - User logout
- `isAuthenticated()` - Check if user is logged in
- `getUserId()` - Get current user ID
- `getUserName()` - Get current user name

#### `userService.js`
Handles user-specific API calls:
- `getUserSemesters(personId)` - Get user's semesters
- `getUserParticipations(personId, semesterId, groupId)` - Get participations
- `updateWeeklyRecord(participationId, recordData)` - Update weekly record

### 2. New Components

#### `UserLogin.jsx`
User login page with:
- Name and password fields
- Link to admin login
- Error handling
- Redirects to profile after login

#### `UserProfile.jsx`
User profile page showing:
- List of semesters user is enrolled in
- Groups within each semester
- Clickable group cards to view participations
- Logout button

#### `UserParticipation.jsx`
Participation records page with:
- View all participation records for a semester/group
- Display weekly record details (service attendance, summaries, QT, reading, prayer, memorization)
- Edit existing records
- Add new records
- Form validation
- Back to profile button

### 3. Updated Routing

**`App.jsx`** now includes:
- `/user/login` - User login page
- `/user/profile` - User profile showing semesters
- `/user/semester/:semesterId/group/:groupId/participations` - Participation records
- Default route intelligently redirects based on auth status (admin vs user)

## User Flow

```
1. User visits / → Redirects to /user/login
2. User logs in with name and password
3. Redirected to /user/profile
4. Profile shows all semesters and groups user is enrolled in
5. User clicks on a group
6. Shows all participation records for that semester/group
7. User can view and update their weekly records
8. User can navigate back to profile or logout
```

## How to Test

### 1. Start the Backend
```bash
cd /Users/kimsanhae/IdeaProjects/sample
./mvnw spring-boot:run
```

### 2. Start the Frontend
```bash
cd frontend
npm run dev
```

### 3. Access the Application
- **User Login:** http://localhost:5173/user/login
- **Admin Login:** http://localhost:5173/login

### 4. Create Test Data
First, use the admin interface to:
1. Create persons (users)
2. Create groups
3. Add persons to groups
4. Create semesters
5. Add groups to semesters
6. Create participations for persons

**Note:** Person passwords must be BCrypt encrypted. The system will encrypt new passwords when created through the admin panel.

### 5. Test User Login
Use a person's name and password to log in at `/user/login`

## API Examples

### User Login
```bash
curl -X POST http://localhost:8080/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username":"Alice","password":"password123"}'
```

### Get User Semesters
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/user/1/semesters
```

### Get User Participations
```bash
curl -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  http://localhost:8080/api/user/1/participations?semesterId=1&groupId=1
```

### Update Weekly Record
```bash
curl -X PUT http://localhost:8080/api/user/participations/1/record \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "weekNumber": 1,
    "service1": "ontime",
    "service2": "ontime",
    "summary1": true,
    "summary2": true,
    "qt": 6,
    "reading": 35,
    "pray": 7,
    "memorize": 4,
    "submittedDate": "2026-02-16"
  }'
```

## File Structure

```
backend/
  src/main/java/com/example/sample/
    controller/
      UserController.java (NEW)
    service/
      PersonService.java (UPDATED)
    security/
      SecurityConfig.java (UPDATED)

frontend/
  src/
    components/
      UserLogin.jsx (NEW)
      UserProfile.jsx (NEW)
      UserProfile.css (NEW)
      UserParticipation.jsx (NEW)
      UserParticipation.css (NEW)
      Login.css (UPDATED)
    services/
      userAuthService.js (NEW)
      userService.js (NEW)
    App.jsx (UPDATED)
```

## Features Implemented

### User Profile
- ✅ View all semesters user is enrolled in
- ✅ View all groups within each semester
- ✅ Beautiful card-based UI
- ✅ Logout functionality

### User Participation
- ✅ View all participation records
- ✅ Display weekly record details
- ✅ Edit existing records
- ✅ Create new records
- ✅ Form validation (QT: 0-6, Reading: 0-35, Prayer: 0-7, Memorize: 0-4)
- ✅ Service attendance tracking (ontime/late/absent)
- ✅ Sermon summary completion tracking
- ✅ Back navigation to profile

### Authentication
- ✅ Separate user and admin login flows
- ✅ JWT token authentication
- ✅ BCrypt password encryption
- ✅ Persistent login state
- ✅ Automatic redirects based on auth status

## Next Steps

1. **Test the complete flow:**
   - Create test users via admin panel
   - Log in as a user
   - View profile and participations
   - Update weekly records

2. **Optional Enhancements:**
   - Add profile editing for users
   - Add statistics/progress tracking
   - Add email notifications
   - Add mobile responsive improvements
   - Add loading states and animations

## Notes

- User authentication is separate from admin authentication
- Users can only view and update their own records
- Admin panel remains unchanged and functional
- All user endpoints are protected by JWT authentication
- Frontend uses localStorage to persist auth state
