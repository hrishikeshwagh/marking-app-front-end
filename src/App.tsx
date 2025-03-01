import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import TeacherLogin from './components/TeacherLogin';
import StudentList from './components/StudentList';
import AddAssignment from './components/AddAssignment';
import AddStudent from './components/AddStudent';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      {isLoggedIn && <Navbar />} {/* Show navbar only if logged in */}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Navigate to="/students" /> : <TeacherLogin onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="/students" element={isLoggedIn ? <StudentList /> : <Navigate to="/" />} />
        <Route path="/add-student" element={<AddStudent />} />
        <Route path="/assignments" element={isLoggedIn ? <AddAssignment /> : <Navigate to="/" />} />
        <Route path="/logout" element={<Logout onLogout={() => setIsLoggedIn(false)} />} />
        <Route path="*" element={<h2 className="text-center">404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
};

const Logout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  onLogout();
  return <Navigate to="/" />;
};

export default App;
