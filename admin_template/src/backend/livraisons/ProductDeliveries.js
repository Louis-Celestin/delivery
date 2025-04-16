import axios from "axios";
import urlBase from '../const';


export class ProductDeliveries{
  async deliver(commentaire, type_livraison_id, user_id, isAncienne, produitsLivre){
      try {
        const response = await axios.post(`${urlBase}/api/delivery/deliver`,
           {commentaire,
            type_livraison_id,
            user_id,
            isAncienne,
            produitsLivre});
        console.log(response)
        return response.data;
      } catch (error) {
        throw error.response.data;
      }
    };

    async getAllLivraisons(){
      try{
        const response = await axios.get(`${urlBase}/api/delivery/getAllLivraisons`)
        console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };

    async getOneLivraison(id){
      try{
        const response = await axios.get(`${urlBase}/api/delivery/getOneLivraison/${id}`)
        console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };
}