import axios from "axios";
import urlBase from '../const';



export const Deliver = async (commentaire, type_livraison_id, user_id, isAncienne, produitsLivre) => {
    try {
      const response = await axios.post(`${urlBase}/api/delivey/deliver`, {commentaire, type_livraison_id, user_id, isAncienne, produitsLivre});
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };