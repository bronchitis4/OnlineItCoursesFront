import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Schedule from './pages/Schedule';
import Profile from './pages/Profile';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ReviewsList from './components/ReviewsList';
import './styles.css';

function App() {
  const [userCourses, setUserCourses] = useState(() => {
    const saved = localStorage.getItem('userCourses');
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('userCourses', JSON.stringify(userCourses));
  }, [userCourses]);

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/course/:id' element={<ReviewsList/>}/>
            <Route path="/courses" element={<Courses userCourses={userCourses} setUserCourses={setUserCourses} />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/profile" element={<Profile userCourses={userCourses} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;