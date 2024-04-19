import axios from 'axios';

const API_URL = 'http://localhost:8083/start'; // Replace with your MongoDB API URL

const MatchService = {
    startReceive: async (token, reqBody) => {
        try {
            const response = await axios.post(`${API_URL}/receive`, reqBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error searching for a match:', error);
            return error;// return the error for handling in the component
        }
    },
    stopReceive: async (token, reqBody) => {
        try {
            const response = await axios.post(`${API_URL}/stop`, reqBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error stopping for a match:', error);
            return error;// return the error for handling in the component
        }
    },
    listen: async (token, reqBody) => {
        try {
            const response = await axios.post(`${API_URL}/listen`, reqBody,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                }
            );
            // console.log(response.data)
            return response.data;
        } catch (error) {
            // console.log('Error listening for a match:', error);
            // return error;// return the error for handling in the component
        }
    },
}
export default MatchService;
