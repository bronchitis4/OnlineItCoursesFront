import { db } from "../config/dbConfig.js";
import admin from 'firebase-admin';

class ReviewsConroller {

    getReviewsById = async (req, res) => {
        const id = req.query.id;

        const reformDate = (data) => {
            const sortedData = data.sort((a, b) =>new Date(b.createdAt) - new Date(a.createdAt));
            
            return sortedData.map(item => {
                const refDate = item.createdAt.split('T');
                const withoutTime = refDate[0].split('-');
                return {
                    ...item,
                    createdAt: withoutTime.join('.')
                };
            });
        };


        try {
            const courseRef = db.collection('courses').doc(id);
            const doc = await courseRef.get();

            if (!doc.exists) {
                return res.status(500).json({
                    statusCode: 500,
                    message: 'Курс не знайдено'
                });
            }

            const data = doc.data();
            const feedbacks = reformDate(data.feedbacks) || [];

            return res.status(200).json({
                statusCode: 200,
                data: feedbacks
            });
        } catch (error) {
            return res.status(500).json({
                statusCode: 500,
                message: error.message,
                data: []
            }); 
        }
        
    }
    
    createNewReview = async (req, res) => {
        console.log(req.body);
        const {userId, courseId, userName, text } = req.body;
        console.log("юзер айді " + userId);

        if (text.length < 10 || text.length > 500) {
            return res.status(400).json({ 
                statusCode: 400, 
                message: 'Діапазон символів від 10 до 500' }
            );
        }

        try {
            const courseRef = db.collection('courses').doc(courseId);
           
            const newFeedback = {
                userId,
                userName,
                courseId,
                text,
                createdAt: new Date().toISOString()
            };

            await courseRef.update({
                feedbacks: admin.firestore.FieldValue.arrayUnion(newFeedback)
            });

            return res.status(201).json({ 
                statusCode: 201, 
                message: 'Відгук додано успішно',
                data: newFeedback
            });

        } catch (error) {
            return res.status(500).json({ 
                statusCode: 500, 
                message: 'Помилка сервера',
                data: null

            });
        }
    }
}

export default ReviewsConroller;