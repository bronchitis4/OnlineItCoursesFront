import { useState } from 'react';
import '../styles.css';
import FeedbackForm from './FeedbackForm';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const CourseCard = ({ course, userCourse = {}, lessons = [], onStart, onCompleteLesson }) => {
  const [showLessons, setShowLessons] = useState(false);
  const isAuthenticated = auth.currentUser;
  const isCourseCompleted = userCourse.completed;

  const handleCardClick = () => {
    if (isAuthenticated && userCourse.id && !isCourseCompleted) {
      setShowLessons(!showLessons);
    }
  };

  const handleStart = (e) => {
    e.stopPropagation();
    onStart();
    setShowLessons(true);
  };

  const handleCompleteLesson = (e, lessonId) => {
    e.stopPropagation();
    onCompleteLesson(lessonId);
  };

  const calculateProgress = () => {
    if (lessons.length === 0) return 0;
    const completed = lessons.filter(lesson => lesson.completed).length;
    return Math.round((completed / lessons.length) * 100);
  };
  return (
    <div 
      className={`course-card ${isCourseCompleted ? 'completed' : ''} ${userCourse.id ? 'clickable' : ''}`}
      onClick={handleCardClick}
    >
      {!showLessons ? (
        <>
          <h3>{course.name}</h3>
          <p className="course-description">{course.description}</p>
          <p className="course-duration">Довжина: {course.duration} тижнів</p>

          {isAuthenticated ? (
            <>
              <p className="course-level">Рівень: {course.level}</p>
              <p className="course-teacher">Викладач: {course.teacher}</p>
              
              <div className="progress-container">
                <div 
                  className="progress-bar" 
                  style={{ width: `${userCourse.progress || 0}%` }}
                ></div>
              </div>
              <p>Прогрес: {userCourse.progress || 0}%</p>
              
              <div className="course-actions" onClick={e => e.stopPropagation()}>
                {!userCourse.id ? (
                 <> 
                  <button className="start-btn" onClick={handleStart}>
                    Почати курс
                  </button>
                  <button className="start-btn">
                    <Link to={`/course/${course.id}`}>
                      Відгуки
                    </Link>
                  </button>
                </>
                ) : isCourseCompleted && (
                  <> <div className="completed-label">
                    <span>Курс завершено</span>
                  </div>
                  <button className="start-btn">
                    <Link to={`/course/${course.id}`} className='review-btn'>
                      Відгуки
                    </Link>
                  </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="auth-message">
              Увійдіть, щоб отримати доступ до курсу
            </div>
          )}
        </>
      ) : (
        <div className="lessons-view">
          <h3>Уроки курсу "{course.name}"</h3>
          
          <div className="lessons-list">
            {lessons.map((lesson, index) => (
              <div 
                key={lesson.id} 
                className={`lesson-item ${lesson.completed ? 'completed' : ''}`}
                onClick={e => e.stopPropagation()}
              >
                <div className="lesson-info">
                  <span className="lesson-number">Урок {index + 1}:</span>
                  <span className="lesson-title">{lesson.title}</span>
                </div>
                
                {lesson.completed ? (
                  <span className="lesson-status">✓</span>
                ) : (
                  <button className="complete-lesson-btn" onClick={(e) => handleCompleteLesson(e, lesson.id)}>Завершити</button>
                )}
              </div>
            ))}
          </div>
          
          {isCourseCompleted && (
            <div className="feedback-section" onClick={e => e.stopPropagation()}>
              <FeedbackForm courseId={course.id} />
            </div>
          )}
          <button className="start-btn">
                    <Link to={`/course/${course.id}`} className='review-btn'>
                      Відгуки
                    </Link>
                  </button>
        </div>
      )}
    </div>
  );
};

export default CourseCard;