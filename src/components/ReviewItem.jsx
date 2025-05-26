const ReviewItem = ({userName, text, createdAt}) => {
   
    return (
        <div className="review-list-item">
            <p>{userName}</p>
            <p>{text}</p>
            <p>{createdAt}</p>
        </div>
    )
}

export default ReviewItem;