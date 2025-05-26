const CourseProgress = ({ course }) => {
    return (
      <li>
        {course.name} - {course.progress}%
        <div className="progress-container">
          <div className="progress-bar green" style={{ width: `${course.progress}%` }}></div>
        </div>
        {course.completed && (
          <p className="certificate-label">Сертифікат отримано</p>
        )}
      </li>
    );
  };
  
  export default CourseProgress;