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

import MatchService from './services/MatchService';
import Matched from './components/Matching/Matched';

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
  const timeInterval = 30000 / 100;

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
  const [category, setCategory] = useState(() => {
    const storedCategory = localStorage.getItem('category');
    return storedCategory //|| 1; // Return stored value or empty string if not found
  });
  const [opponentName, setOpponentName] = React.useState("");

  const startTimer = (category) => {
    setTimerRun(true);
    setCategory(category)
    timerRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress >= 100 ? 100 : prevProgress + 1;
        if (newProgress >= 100) {
          cancelTimer();
          alert("Timeout! Match not found!")
        } else {
          listen({
            topic: category,
            msg: user.username
          });
        }
        return newProgress;
      });
    }, timeInterval);
  };

  const cancelTimer = async () => {
    setTimerRun(false);
    clearInterval(timerRef.current);
    await MatchService.stopReceive(accessCode, {
      topic: category,
      msg: user.username
    });
    setProgress(0);
  };

  const listen = async (reqBody) => {
    await MatchService.listen(accessCode, reqBody)
      .then(response => {
        if (response && response.message && response.message.indexOf("matched") != -1) {
          cancelTimer();
          alert(response.message)
          var oppName = response.message.replace("You are matched with ", "");
          setOpponentName(oppName)
        }
      })
      .catch(error => {
        // Request failed, handle accordingly
        console.error('Error starting to receive logs:', error);
      });
  }
  const leaveRoom = () => {
    setOpponentName("");
  }


  // Theme
  const [mode, setMode] = React.useState('light');
  const toggleColorMode = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const getUserDetails = async () => {
    const res = await UserService.getUser(accessCode, email);
    if (res.userDetails) {
      setUser(res.userDetails.username ? res.userDetails : { ...res.userDetails, username: 'angel' });
    }
  }

  useEffect(() => {
    localStorage.setItem('accessCode', accessCode);
    localStorage.setItem('email', email);
    if (accessCode != "" && email != "") {
      getUserDetails(accessCode, email);
    }
  }, [accessCode, email]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} setAccessCode={setAccessCode} setEmail={setEmail} />} />
        <Route path="/signup" element={<SignUp setIsLoggedIn={setIsLoggedIn} />} />
        <Route
          path="/home"
          element={isLoggedIn ?
            (
              opponentName == "" ?
                <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer} >
                  <QuestionList token={accessCode} />
                </Layout>
                :
                <Navigate to="/match" replace />
            )
            :
            <Navigate to="/" replace />}
        />
        <Route
          path="/question/:id"
          element={isLoggedIn ?
            (
              opponentName == "" ?
                <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer}>
                  <QuestionDetail token={accessCode} />
                </Layout>
                :
                <Navigate to="/match" replace />
            )
            :
            <Navigate to="/" replace />}
        />
        <Route
          path="/findmatch"
          element={isLoggedIn ?
            (
              opponentName == "" ?
                <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer}>
                  <FindMatch user={user} token={accessCode} timerRun={timerRun} progress={progress} startTimer={startTimer} cancelTimer={cancelTimer} />
                </Layout> :
                <Navigate to="/match" replace />
            )
            :
            <Navigate to="/" replace />}
        />
        <Route
          path="/match"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress} cancelTimer={cancelTimer}>
              <Matched user={user} token={accessCode} opponentName={opponentName} leaveRoom={leaveRoom} />
            </Layout>
            :
            <Navigate to="/" replace />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ?
            <Layout user={user.username} mode={mode} toggleColorMode={toggleColorMode} setIsLoggedIn={setIsLoggedIn} timerRun={timerRun} progress={progress}>
              <Profile user={user} token={accessCode} />
            </Layout>
            :
            <Navigate to="/" replace />}
        />
      </Routes>
    </Router>
  );
}

export default App;
