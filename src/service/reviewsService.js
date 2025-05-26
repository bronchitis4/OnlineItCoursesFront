import { getAuth } from 'firebase/auth';

class ReviewsService {

    API = "https://onlineitcourses-762p.onrender.com";
    constructor() {
        this.auth = getAuth();
    }
    
    getReviewsByCourseId = async (id) => {

        const user = this.auth.currentUser;
        const idToken = await user.getIdToken();
        const response = await fetch(
            `${this.API}/reviews?id=${id}`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }}
        );

        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    }

    createReview = async (data) => {
        
        const user = this.auth.currentUser;
        const idToken = await user.getIdToken();
        try {
            console.log(data);
            const response = await fetch(`${this.API}/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                     Authorization: `Bearer ${idToken}`,
                },
                body: JSON.stringify(data)
            });

            // if (!response.ok)
            //     throw Error("Error creation review");
            const responseData = response.json();
            console.log(responseData);
            return responseData;
        } catch (error) {
            return error;
        }
        
    }
}

export default ReviewsService;