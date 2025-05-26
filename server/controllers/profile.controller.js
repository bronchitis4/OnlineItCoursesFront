
class ProfileController {
    getUserProfile = async (req, res) => {
        const user = req.user;
        try {
            if (!user)
                throw Error("User not found");
            
            return res.status(200).json({
                statusCode: 200,
                message: "Дані користувача отримано",
                data: user
            });
        } catch (error) {
            return res.status(404).json({
                statusCode: 404,
                message: error.message,
                data: user
            })
        }
    }
}

export default ProfileController;