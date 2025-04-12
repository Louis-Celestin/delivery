import axios from 'axios';
import urlBase from '../const';

// const API_URL = urlOnline

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${urlBase}/api/auth/login`, { email, password });
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};