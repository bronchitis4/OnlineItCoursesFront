import { useState } from 'react';
import { doc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import ReviewsService from '../service/reviewsService';
import { db, auth } from '../firebase';

const FeedbackForm = ({ courseId }) => {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const reviewsService = new ReviewsService();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!auth.currentUser) {
      setError('Будь ласка, увійдіть, щоб залишити відгук');
      return;
    }

    if (!feedback.trim()) {
      setError('Будь ласка, введіть ваш відгук');
      return;
    }

    try {
      const feedbackData = {
        userId: auth.currentUser.uid,
        courseId,
        text: feedback,
        createdAt: new Date().toISOString(),
        userName: auth.currentUser.displayName || 'Анонімний користувач'
      };
      console.log(feedbackData);

      const response = await reviewsService.createReview(feedbackData);
      console.log(response);
      
      if(response.statusCode == 400) {
        setError(response.message);
        return response.message;
      }
      // const courseRef = doc(db, 'courses', courseId);
      // await setDoc(courseRef, {
      //   feedbacks: arrayUnion(feedbackData)
      // }, { merge: true });

      // const userRef = doc(db, 'users', auth.currentUser.uid);
      // await setDoc(userRef, {
      //   feedbacks: arrayUnion({
      //     courseId,
      //     text: feedback,
      //     createdAt: new Date().toISOString()
      //   })
      // }, { merge: true });

      setSubmitted(true);
      setFeedback('');
      setError('');
    } catch (err) {
      setError('Сталася помилка при збереженні відгуку');
    }
  };

  if (submitted) {
    return <p className="success-message">Дякуємо за ваш відгук!</p>;
  }

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Ваш відгук про курс..."
        rows="3"
      />
      <button type="submit" className="submit-btn">Надіслати відгук</button>
    </form>
  );
};

export default FeedbackForm;