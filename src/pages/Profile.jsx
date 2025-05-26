import '../styles.css';
import { auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import CourseProgress from '../components/CourseProgress';
import ProfileService from '../service/profileService';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('courses');
  const [courseNames, setCourseNames] = useState({});
  const profileService = new ProfileService();  

  useEffect(() => {
    const fetchUserData = async () => {
      if (auth.currentUser) {
        try {
          const response = await profileService.getUserData();
          setUserProfile(response.data);

          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            if (data.feedbacks?.length > 0) {
              const names = {};
              const promises = data.feedbacks.map(async (feedback) => {
                if (!names[feedback.courseId]) {
                  const courseDoc = await getDoc(doc(db, 'courses', feedback.courseId));
                  if (courseDoc.exists()) {
                    names[feedback.courseId] = courseDoc.data().name;
                  }
                }
              });

              await Promise.all(promises);
              setCourseNames(names);
            }
          }
        } catch (error) {
          console.error("Помилка завантаження даних:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <div className="loading">Завантаження профілю...</div>;
  if (!auth.currentUser) return <div className="auth-message">Увійдіть, щоб переглянути профіль</div>;

  return (
    <div className="profile-info">
      <h1>Мій кабінет</h1>
      <img src="/ava.jpg" alt="Фото профілю" />
      <p><strong>Ім'я:</strong> {userData?.name || auth.currentUser.displayName || 'Іван Петренко'}</p>
      <p><strong>Email:</strong> {userProfile.email}</p>
      
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'courses' ? 'active' : ''}`}
          onClick={() => setActiveTab('courses')}
        >
          Мої курси
        </button>
        <button 
          className={`tab-btn ${activeTab === 'feedbacks' ? 'active' : ''}`}
          onClick={() => setActiveTab('feedbacks')}
        >
          Мої відгуки
        </button>
      </div>

      {activeTab === 'courses' ? (
        <section className="courses-certificates">
          <h2>Мої курси</h2>
          {userData?.courses?.length > 0 ? (
            <ul className="profile-courses-list">
              {userData.courses.map((course) => (
                <CourseProgress key={course.id} course={course} />
              ))}
            </ul>
          ) : (
            <p>Ви ще не почали жодного курсу</p>
          )}
        </section>
      ) : (
        <section className="user-feedbacks">
          <h2>Мої відгуки</h2>
          {userData?.feedbacks?.length > 0 ? (
            <div className="feedbacks-list">
              {userData.feedbacks.map((feedback, index) => (
                <div key={index} className="feedback-item">
                  <p className="feedback-course">
                    Курс: {courseNames[feedback.courseId] || `ID: ${feedback.courseId}`}
                  </p>
                  <p className="feedback-text">{feedback.text}</p>
                  <p className="feedback-date">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>Ви ще не залишили жодного відгуку</p>
          )}
        </section>
      )}
    </div>
  );
};

export default Profile;