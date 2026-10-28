import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Announcements from './pages/Announcements';
import Training from './pages/Training';
import Profile from './pages/Profile';

export default function App() {
  const wrap = (el, roles) => <ProtectedRoute roles={roles}>{el}</ProtectedRoute>;
  return (
    <>
      <Navbar />
      <div className="container py-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={wrap(<Dashboard />)} />
          <Route path="/employees" element={wrap(<Employees />, ['hr', 'manager'])} />
          <Route path="/leaves" element={wrap(<Leaves />)} />
          <Route path="/attendance" element={wrap(<Attendance />)} />
          <Route path="/announcements" element={wrap(<Announcements />)} />
          <Route path="/training" element={wrap(<Training />)} />
          <Route path="/profile" element={wrap(<Profile />)} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </>
  );
}
