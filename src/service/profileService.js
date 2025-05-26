import { getAuth } from "firebase/auth";

class ProfileService {

    API = "https://onlineitcourses-762p.onrender.com";
    constructor() {
        this.auth = getAuth();
    }

    getUserData = async () => {
        const user = this.auth.currentUser;
        const idToken = await user.getIdToken();
        const response = await fetch(`${this.API}/profile`, {
            headers: {
                Authorization: `Bearer ${idToken}`,
            }});
        const responseData = await response.json();
        
        console.log(responseData);
        
        return responseData;
    }
}

export default ProfileService;