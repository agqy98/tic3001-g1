import axios from 'axios';

const API_URL = 'http://localhost:8081/auth'; // MongoDB API URL

const AuthService = {
    login: async (userData) => {
        try {
            const response = await axios.post(`${API_URL}/login`, userData);
            return response.data;
        } catch (error) {
            console.error('Error logging in:', error);
            return error;
        }
    }
}
export default AuthService