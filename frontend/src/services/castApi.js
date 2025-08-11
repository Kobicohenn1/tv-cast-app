import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const fetchCast = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cast`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cast data', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Error fetching cast data';
    throw { status, message };
  }
};

export const deletePlayer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/cast/${id}`);
    return response.data; // Return the response message
  } catch (error) {
    console.error('Error deleting player', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Error deleting player';
    throw { status, message };
  }
};

export const addComment = async (playerId, comment) => {
  try {
    await axios.post(`${API_BASE_URL}/cast/add-comment/${playerId}`, {
      comment,
    });
  } catch (error) {
    console.error('Error adding comment:', error);
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Error adding comment';
    throw { status, message };
  }
};
