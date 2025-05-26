import { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc, getDoc, writeBatch } from 'firebase/firestore';
import { db, auth } from '../firebase';
import CourseCard from '../components/CourseCard';
import '../styles.css';

const DEFAULT_COURSES = [
  {
    id: 'course_1',
    name: 'Основи програмування',
    level: 'Початковий',
    duration: 6,
    category: 'Програмування',
    teacher: 'Іван Петров',
    description: 'Навчіться основам алгоритмів та синтаксису мов програмування'
  },
  {
    id: 'course_2',
    name: 'Веб-розробка',
    level: 'Середній',
    duration: 8,
    category: 'Веб',
    teacher: 'Ольга Коваль',
    description: 'Створення сучасних веб-додатків з використанням HTML, CSS та JavaScript'
  },
  {
    id: 'course_3',
    name: 'Машинне навчання',
    level: 'Просунутий',
    duration: 10,
    category: 'Data Science',
    teacher: 'Андрій Сидоренко',
    description: 'Основи алгоритмів машинного навчання та їх практичне застосування'
  },
  {
    id: 'course_4',
    name: 'Аналіз даних',
    level: 'Середній',
    duration: 9,
    category: 'Data Science',
    teacher: 'Марія Іваненко',
    description: 'Методи аналізу даних з використанням Python та бібліотек pandas, numpy'
  },
  {
    id: 'course_5',
    name: 'Кібербезпека',
    level: 'Просунутий',
    duration: 12,
    category: 'Безпека',
    teacher: 'Дмитро Орлов',
    description: 'Захист інформації та методи забезпечення безпеки в інформаційних системах'
  },
  {
    id: 'course_6',
    name: 'Розробка мобільних додатків',
    level: 'Середній',
    duration: 8,
    category: 'Мобільна розробка',
    teacher: 'Вікторія Романюк',
    description: 'Створення мобільних застосунків для Android та iOS'
  },
  {
    id: 'course_7',
    name: 'Комп`ютерна графіка',
    level: 'Початковий',
    duration: 7,
    category: 'Графіка',
    teacher: 'Сергій Павленко',
    description: 'Базові поняття комп`ютерної графіки та робота з графічними редакторами'
  },
  {
    id: 'course_8',
    name: 'Бази даних',
    level: 'Середній',
    duration: 8,
    category: 'Бази даних',
    teacher: 'Наталія Шевченко',
    description: 'Проєктування, створення та управління базами даних SQL'
  },
  {
    id: 'course_9',
    name: 'Штучний інтелект',
    level: 'Просунутий',
    duration: 11,
    category: 'AI',
    teacher: 'Роман Гаврилюк',
    description: 'Основи побудови інтелектуальних систем та глибинного навчання'
  },
  {
    id: 'course_10',
    name: 'Алгоритми та структури даних',
    level: 'Середній',
    duration: 10,
    category: 'Програмування',
    teacher: 'Максим Козлов',
    description: 'Ефективне використання алгоритмів і структур даних у розробці програм'
  },
  {
    id: 'course_11',
    name: 'DevOps та хмарні технології',
    level: 'Просунутий',
    duration: 12,
    category: 'Інфраструктура',
    teacher: 'Олександр Мельник',
    description: 'Автоматизація розгортання та управління хмарною інфраструктурою'
  },
  {
    id: 'course_12',
    name: 'Комп`ютерні мережі',
    level: 'Середній',
    duration: 9,
    category: 'Мережі',
    teacher: 'Юрій Бондар',
    description: 'Побудова, управління та діагностика комп`ютерних мереж'
  },
  {
    id: 'course_13',
    name: 'Розробка ігор',
    level: 'Просунутий',
    duration: 14,
    category: 'Ігри',
    teacher: 'Олег Ткаченко',
    description: 'Процес створення 2D та 3D ігор на сучасних ігрових рушіях'
  },
  {
    id: 'course_14',
    name: 'Розширена обробка зображень',
    level: 'Просунутий',
    duration: 10,
    category: 'Комп`ютерний зір',
    teacher: 'Андрій Лисенко',
    description: 'Алгоритми та методи обробки зображень за допомогою OpenCV'
  },
  {
    id: 'course_15',
    name: 'Розумні системи та IoT',
    level: 'Середній',
    duration: 8,
    category: 'IoT',
    teacher: 'Світлана Григоренко',
    description: 'Побудова інтернету речей та інтеграція з інтелектуальними пристроями'
  },
  {
    id: 'course_16',
    name: 'UI/UX Дизайн',
    level: 'Просунутий',
    duration: 10,
    category: 'Дизайн',
    teacher: 'Микола Савченко',
    description: 'Принципи створення інтуїтивного та привабливого інтерфейсу користувача'
  }
];

const DEFAULT_LESSONS = {
  course_16: [
    { id: 'lesson_16_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_16_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_16_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_16_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_16_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_1: [
    { id: 'lesson_1_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_1_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_1_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_1_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_1_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_2: [
    { id: 'lesson_2_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_2_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_2_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_2_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_2_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_3: [
    { id: 'lesson_3_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_3_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_3_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_3_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_3_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_4: [
    { id: 'lesson_4_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_4_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_4_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_4_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_4_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_5: [
    { id: 'lesson_5_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_5_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_5_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_5_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_5_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_6: [
    { id: 'lesson_6_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_6_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_6_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_6_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_6_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_7: [
    { id: 'lesson_7_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_7_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_7_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_7_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_7_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_8: [
    { id: 'lesson_8_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_8_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_8_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_8_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_8_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_9: [
    { id: 'lesson_9_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_9_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_9_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_9_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_9_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_10: [
    { id: 'lesson_10_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_10_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_10_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_10_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_10_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_11: [
    { id: 'lesson_11_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_11_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_11_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_11_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_11_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_12: [
    { id: 'lesson_12_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_12_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_12_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_12_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_12_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_13: [
    { id: 'lesson_13_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_13_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_13_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_13_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_13_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_14: [
    { id: 'lesson_14_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_14_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_14_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_14_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_14_5', title: 'Функції', duration: 2, completed: false }
  ],
  course_15: [
    { id: 'lesson_15_1', title: 'Вступ до програмування', duration: 2, completed: false },
    { id: 'lesson_15_2', title: 'Змінні та типи даних', duration: 3, completed: false },
    { id: 'lesson_15_3', title: 'Умовні оператори', duration: 2, completed: false },
    { id: 'lesson_15_4', title: 'Цикли', duration: 3, completed: false },
    { id: 'lesson_15_5', title: 'Функції', duration: 2, completed: false }
  ]
};

const Courses = () => {
  const [sortByDuration, setSortByDuration] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allCourses, setAllCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  const [userLessons, setUserLessons] = useState({});
  const [loading, setLoading] = useState(true);

  const initializeFirestore = async () => {
    try {
      const coursesCollection = collection(db, 'courses');
      const coursesSnapshot = await getDocs(coursesCollection);

      if (coursesSnapshot.empty) {
        const batch = writeBatch(db);
        DEFAULT_COURSES.forEach(course => {
          const docRef = doc(db, 'courses', course.id);
          batch.set(docRef, { ...course });
        });
        await batch.commit();
        console.log('Дефолтні курси додано');
        return DEFAULT_COURSES;
      } else {
        return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }
    } catch (error) {
      console.error('Помилка ініціалізації Firestore:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courses = await initializeFirestore();
        setAllCourses(courses);

        if (auth.currentUser) {
          const userDocRef = doc(db, 'users', auth.currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUserCourses(userDoc.data().courses || []);
            setUserLessons(userDoc.data().lessons || {});
          } else {
            await setDoc(userDocRef, { courses: [], lessons: {} });
            setUserCourses([]);
            setUserLessons({});
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Помилка завантаження:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateUserData = async (updatedCourses, updatedLessons) => {
    if (!auth.currentUser) return;
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, { 
        courses: updatedCourses || userCourses,
        lessons: updatedLessons || userLessons
      }, { merge: true });
      
      if (updatedCourses) setUserCourses(updatedCourses);
      if (updatedLessons) setUserLessons(updatedLessons);
    } catch (error) {
      console.error('Помилка оновлення даних:', error);
    }
  };

  const handleStartCourse = async (courseId) => {
    const course = allCourses.find(c => c.id === courseId);
    if (!userCourses.some(c => c.id === courseId)) {
      const updatedCourses = [
        ...userCourses,
        { id: courseId, name: course.name, progress: 0, completed: false }
      ];
      
      const updatedLessons = { ...userLessons };
      if (!updatedLessons[courseId]) {
        updatedLessons[courseId] = DEFAULT_LESSONS[courseId] || [];
      }
      
      await updateUserData(updatedCourses, updatedLessons);
    }
  };

  const handleCompleteLesson = async (courseId, lessonId) => {
    const updatedLessons = { ...userLessons };
    if (updatedLessons[courseId]) {
      updatedLessons[courseId] = updatedLessons[courseId].map(lesson => 
        lesson.id === lessonId ? { ...lesson, completed: true } : lesson
      );
      
      const allLessonsCompleted = updatedLessons[courseId].every(lesson => lesson.completed);
      
      let updatedCourses = [...userCourses];
      if (allLessonsCompleted) {
        updatedCourses = updatedCourses.map(course => 
          course.id === courseId 
            ? { ...course, progress: 100, completed: true } 
            : course
        );
      } else {
        const completedCount = updatedLessons[courseId].filter(lesson => lesson.completed).length;
        const totalLessons = updatedLessons[courseId].length;
        const newProgress = Math.round((completedCount / totalLessons) * 100);
        
        updatedCourses = updatedCourses.map(course => 
          course.id === courseId ? { ...course, progress: newProgress } : course
        );
      }
      
      await updateUserData(updatedCourses, updatedLessons);
    }
  };

  const filteredCourses = allCourses.filter(course =>
    selectedCategory === 'all' || course.category === selectedCategory
  );

  const sortedCourses = [...filteredCourses].sort((a, b) =>
    sortByDuration ? a.duration - b.duration : 0
  );

  const categories = ['all', ...new Set(allCourses.map(course => course.category))];

  if (loading) return <div className="loading">Завантаження курсів...</div>;

  return (
    <div className="courses">
      <h1>Наші Курси</h1>

      <div className="courses-controls">
        <button
          onClick={() => setSortByDuration(!sortByDuration)}
          className={`sort-btn ${sortByDuration ? 'active' : ''}`}
        >
          {sortByDuration ? 'Скасувати сортування' : 'Сортувати за тривалістю'}
        </button>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category === 'all' ? 'Всі категорії' : category}
            </option>
          ))}
        </select>
      </div>

      <div className="courses-grid">
        {sortedCourses.map(course => {
          const userCourse = userCourses.find(uc => uc.id === course.id) || {};
          const lessons = userLessons[course.id] || [];
          return (
            <CourseCard
              key={course.id}
              course={course}
              userCourse={userCourse}
              lessons={lessons}
              onStart={() => handleStartCourse(course.id)}
              onCompleteLesson={(lessonId) => handleCompleteLesson(course.id, lessonId)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Courses;