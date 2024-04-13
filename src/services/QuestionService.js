import axios from 'axios';

const API_URL = 'http://localhost:8080/questions'; // Replace with your MongoDB API URL

const QuestionService = {
  // Fetch all questions
  getAllQuestions: async (token) => {
    try {
      const response = await axios.get(`${API_URL}/all`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return error;// return the error for handling in the component
    }
  },
  // Fetch question by id 
  getQuestionById: async (token, questionId) => {
    try {
      const response = await axios.get(`${API_URL}/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching question ${questionId}:`, error);
      return error; // return the error for handling in the component
    }
  },

  // Create a new question
  createQuestion: async (token, questionData) => {
    try {
      const response = await axios.post(`${API_URL}`, questionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating question:', error);
      return error; // return the error for handling in the component
    }
  },

  // Update an existing question
  updateQuestion: async (token, questionId, questionData) => {
    try {
      const response = await axios.put(`${API_URL}/${questionId}`, questionData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating question:', error);
      return error; // return the error for handling in the component
    }
  },

  // Delete a question
  deleteQuestion: async (token, questionId) => {
    try {
      const response = await axios.delete(`${API_URL}/${questionId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting question:', error);
      return error; // return the error for handling in the component
    }
  }
};

export default QuestionService;
