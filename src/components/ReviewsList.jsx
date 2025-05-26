import { use, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReviewsService from "../service/reviewsService";
import ReviewItem from "./ReviewItem";

const ReviewsList = () => {
    const {id} = useParams();
    const [feedbacks, setFeedbacks] = useState([]);
    const [error, serError] = useState(false);
    const [loading, setLoading] = useState(false);
    const reviewsService = new ReviewsService();

    useEffect(()=> {
        const fetchReviews = async () => {
            setLoading(true);
            try{
                const response = await reviewsService.getReviewsByCourseId(id);
                setFeedbacks(response.data);
            }catch(error) {
                serError(error.message);
            }finally{
                setLoading(false);

            }
        }

        fetchReviews();
    }, [])


    return (
        <div className="review-list-wrapper">
            <h1>Відгуки</h1>
            {error && <p>Відгуків не знайдено</p>}
            {loading && <p>Завантаження...</p>}
            {feedbacks.map(item=> {
                return <ReviewItem key={item.text} userName={item.userName} text={item.text} createdAt={item.createdAt}/>
            })}
        </div>
    )
}

export default ReviewsList;