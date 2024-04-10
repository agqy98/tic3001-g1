import axios from 'axios';

const USER_SERVICE_URL = 'http://host.docker.internal:8081';

export async function findUserByEmailFromMicroservice(email, token) {
    console.log("Email is..." + email)
    try {
        const response = await axios.get(`${USER_SERVICE_URL}/users/${email}`, {
            headers: {
                Authorization: `Bearer ${token}` // Set Authorization header with JWT token
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error while fetching user:', error);
        return null;
    }
}
