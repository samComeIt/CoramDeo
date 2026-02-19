import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import UserLogin from './components/UserLogin';
import Dashboard from './components/Dashboard';
import Admins from './components/Admins';
import Groups from './components/Groups';
import Persons from './components/Persons';
import Semesters from './components/Semesters';
import SemesterGroups from './components/SemesterGroups';
import GroupPersons from './components/GroupPersons';
import Participations from './components/Participations';
import AdminParticipations from './components/AdminParticipations';
import Books from './components/Books';
import UserProfile from './components/UserProfile';
import UserParticipation from './components/UserParticipation';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAdminAuthenticated, isUserAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Admin Login */}
        <Route
          path="/login"
          element={isAdminAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
        />

        {/* User Login */}
        <Route
          path="/user/login"
          element={isUserAuthenticated ? <Navigate to="/user/profile" replace /> : <UserLogin />}
        />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admins"
          element={
            <PrivateRoute>
              <Admins />
            </PrivateRoute>
          }
        />
        <Route
          path="/groups"
          element={
            <PrivateRoute>
              <Groups />
            </PrivateRoute>
          }
        />
        <Route
          path="/persons"
          element={
            <PrivateRoute>
              <Persons />
            </PrivateRoute>
          }
        />
        <Route
          path="/semesters"
          element={
            <PrivateRoute>
              <Semesters />
            </PrivateRoute>
          }
        />
        <Route
          path="/books"
          element={
            <PrivateRoute>
              <Books />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/participations"
          element={
            <PrivateRoute>
              <AdminParticipations />
            </PrivateRoute>
          }
        />
        <Route
          path="/semesters/:semesterId/groups"
          element={
            <PrivateRoute>
              <SemesterGroups />
            </PrivateRoute>
          }
        />
        <Route
          path="/semesters/:semesterId/groups/:groupId/persons"
          element={
            <PrivateRoute>
              <GroupPersons />
            </PrivateRoute>
          }
        />
        <Route
          path="/semesters/:semesterId/groups/:groupId/persons/:personId/participations"
          element={
            <PrivateRoute>
              <Participations />
            </PrivateRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/profile"
          element={isUserAuthenticated ? <UserProfile /> : <Navigate to="/user/login" replace />}
        />
        <Route
          path="/user/semester/:semesterId/group/:groupId/participations"
          element={isUserAuthenticated ? <UserParticipation /> : <Navigate to="/user/login" replace />}
        />

        {/* Default Route */}
        <Route
          path="/"
          element={
            <Navigate
              to={isAdminAuthenticated ? "/dashboard" : isUserAuthenticated ? "/user/profile" : "/user/login"}
              replace
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;