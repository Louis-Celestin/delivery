import axios from 'axios';
import urlBase from '../const';

// const API_URL = urlOnline

export const changePassword = async (currentPassword, newPassword) => {
    try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${urlBase}/api/auth/change-password`,
        {
            currentPassword,
            newPassword 
        }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      },
    );
    console.log(response)
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};