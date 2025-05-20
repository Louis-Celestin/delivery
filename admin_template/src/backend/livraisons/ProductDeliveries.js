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

    async deliverOld(commentaire, type_livraison_id, isAncienne, date_livraison, nom_livreur, produitsLivre){
      try {
        const response = await axios.post(`${urlBase}/api/delivery/deliver`,
           {commentaire,
            type_livraison_id,
            isAncienne,
            date_livraison,
            nom_livreur,
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

    async updateLivraison(id, produitsLivre, commentaire, statut_livraison, type_livraison_id){
      try{
        const response = await axios.put(`${urlBase}/api/delivery/updateLivraison/${id}`,
        {produitsLivre,
        commentaire,
        statut_livraison,
        type_livraison_id,
        });

        console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };
}