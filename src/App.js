// App.js
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout/Layout'
import Login from './components/Auth/Login';
import SignUp from './components/Auth/Signup';
import Profile from './components/Profile/Profile';
import FindMatch from './components/Matching/FindMatch';
import QuestionList from './components/Question/QuestionList';
import QuestionDetail from './components/Question/QuestionDetail';
import UserService from './services/UserService';

function App() {
  // User Persistence
  const [user, setUser] = React.useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [email, setEmail] = useState(() => {
    const storedEmail = localStorage.getItem('email');
    return storedEmail || ''; // Return stored value or empty string if not found
  });
  const [accessCode, setAccessCode] = useState(() => {
    const storedAccessCode = localStorage.getItem('accessCode');
    return storedAccessCode || ''; // Return stored value or empty string if not found
  });

  // Search Match Persistent
  const timerRef = useRef(null);
  const [timerRun, setTimerRun] = useState(() => {
    const storedRun = localStorage.getItem('timerRun');
    return storedRun //|| false; // Return stored value or empty string if not found
  });
  const [progress, setProgress] = useState(() => {
    const storedProgress = localStorage.getItem('progress');
    return storedProgress //|| 1; // Return stored value or empty string if not found
  });

  const startTimer = () => {
    cancelTimer()
    setTimerRun(true);
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 1));
    }, 1000);
  };

  const cancelTimer = () => {
    setTimerRun(false);
    clearInterval(timerRef.current);
    setProgress(0);
  };

  // Theme
  const [mode, setMode] = React.useState('light');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getUserDetails = async () => {
    const res = await UserService.getUser(accessCode, email);
    if (res.userDetails) {
      setUser(res.userDetails);
    }
  }

  useEffect(() => {
    localStorage.setItem('accessCode', accessCode);
    localStorage.setItem('email', email);
    localStorage.setItem('timerRun', timerRun);
    localStorage.setItem('progress', progress);
    if (accessCode != "" && email != "") {
      getUserDetails(accessCode, email);
    }
  }, [accessCode, email, timerRun, progress]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setAccessCode={setAccessCode} setEmail={setEmail} />} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer} >
              <QuestionList token={accessCode} />
            </Layout>
            :
            <Navigate to="/login" replace />}
        />
        <Route
          path="/question/:id"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer}>
              <QuestionDetail token={accessCode} />
            </Layout>
            :
            <Navigate to="/login" replace />}
        />
        <Route
          path="/findmatch"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer}>
              <FindMatch user={user} token={accessCode} timerRun={timerRun} progress={progress} startTimer={startTimer} cancelTimer={cancelTimer} />
            </Layout>
            :
            <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress}>
              <Profile user={user} token={accessCode} />
            </Layout>
            :
            <Navigate to="/login" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
