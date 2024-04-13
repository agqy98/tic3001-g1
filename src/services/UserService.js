import axios from 'axios';

const API_URL = 'http://localhost:8081/users'; // MongoDB API URL

const UserService = {
  // Create a new user
  createUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      return error; // Throw the error for handling in the component
    }
  },
  getUser: async (token, email) => {
    try {
      const response = await axios.get(`${API_URL}/${email}`, {
        // data: { email: email },
        headers: {
          Authorization: `Bearer ${token}` // Set Authorization header with JWT token
        }
      })
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with email ${email}:`, error);
      return error; // return the error for handling in the component
    }
  },

}
export default UserService;
