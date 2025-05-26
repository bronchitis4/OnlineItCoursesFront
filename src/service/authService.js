
class AuthService {
    API = "https://onlineitcourses-762p.onrender.com";
    register = async (data) => {
        try {
            const response = await fetch(`${this.API}/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Registration failed");

            const responseData = await response.json();
            console.log("Register response:", responseData);

            return responseData;
        } catch (error) {
            console.error("Register error:", error);
            throw error;
        }
    };

    login = async (data) => {
        try {
            const response = await fetch(`${this.API}/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error("Login failed");

            const responseData = await response.json();
            console.log(responseData);

            return responseData;
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    };
}

export default AuthService;
