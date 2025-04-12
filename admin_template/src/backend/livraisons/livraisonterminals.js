import axios from "axios";
import urlBase from '../const';



export const entreeStock = async () => {
    try {
      const response = await axios.post(`${urlBase}/api/transaction/entreeStock`);
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };