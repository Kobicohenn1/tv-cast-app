import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const fetchCast = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cast`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cast data', error);
    throw new Error('Error fetching cast data');
  }
};

export const deletePlayer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cast/${id}`);
    return response.data; // Return the response message
  } catch (error) {
    console.error('Error deleting player', error);
    throw new Error('Error deleting player');
  }
};

export const addComment = async (playerId, comment) => {
  try {
    await axios.post(`${API_BASE_URL}/cast/add-comment/${playerId}`, {
      comment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
};
