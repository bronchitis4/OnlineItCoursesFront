import { getAuth } from "firebase/auth";

class ProfileService {
    constructor() {
        this.auth = getAuth();
    }

    getUserData = async () => {
        const user = this.auth.currentUser;
        const idToken = await user.getIdToken();
        const response = await fetch('http://localhost:3001/profile', {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }});
        const responseData = await response.json();
        
        console.log(responseData);
        
        return responseData;
    }
}

export default ProfileService;