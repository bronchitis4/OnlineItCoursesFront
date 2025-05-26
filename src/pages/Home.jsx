const Home = () => {
  const popularCourses = [
    {
      name: "Основи програмування",
      level: "Початковий",
      duration: 6,
      teacher: "Іван Петров",
      description: "Дізнайтеся, як писати код та розуміти алгоритми."
    },
    {
      name: "Веб-розробка",
      level: "Середній",
      duration: 8,
      teacher: "Ольга Коваль",
      description: "Створюйте сайти за допомогою HTML, CSS та JavaScript."
    }
  ];

  return (
    <>
      <section className="hero">
        <h1>Ласкаво просимо!</h1>
        <p>Освітня платформа для сучасного навчання. Обирайте курси, переглядайте розклад, вдосконалюйте свої навички!</p>
      </section>

      <section className="popular-courses">
        <h2>Популярні курси</h2>
        <div className="courses-grid">
          {popularCourses.map((course, index) => (
            <div key={index} className="popular-courses">
              <h3>{course.name}</h3>
              <p className="course-description">{course.description}</p>
              <p>Рівень: {course.level}</p>
              <p>Тривалість: {course.duration} тижнів</p>
            </div>
          ))}
        </div>
      </section>

      <section className="news">
        <h2>Останні новини</h2>
        <ul>
          <li><strong>Новий курс:</strong> Ми запустили курс "Штучний інтелект для початківців"!</li>
          <li><strong>Оновлення:</strong> Додано новий розділ у профілі користувача.</li>
        </ul>
      </section>

      <section className="about">
        <h2>Про платформу</h2>
        <p>Ми допоможемо вам легко організувати навчальний процес і знаходити необхідні курси.</p>
      </section>
    </>
  );
};

export default Home;