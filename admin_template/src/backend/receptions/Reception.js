import axios from "axios";
import urlBase from '../const';


export class Reception{


  async receive(formData){
    try {
      const response = await axios.post(`${urlBase}/api/receive/receive`, formData, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }})
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async returnDelivery(livraison_id, commentaire_return, user_id, type_livraison_id){
    try{
      const response = await axios.post(`${urlBase}/api/receive/returnDelivery`,
        {
          livraison_id,
          commentaire_return,
          user_id,
          type_livraison_id,
        }
      )
      console.log(response)
        return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async returnDemandeDelivery(livraison_id, commentaire_return, user_id, type_livraison_id, demande_id){
    try{
      const response = await axios.post(`${urlBase}/api/receive/returnDemandeDelivery`,
        {
          livraison_id,
          commentaire_return,
          user_id,
          type_livraison_id,
          demande_id,
        }
      )
      console.log(response)
        return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };
}