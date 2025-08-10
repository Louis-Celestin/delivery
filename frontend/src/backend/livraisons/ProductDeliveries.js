  import axios from "axios";
  import urlBase from '../const';


export class ProductDeliveries{
  async deliver(formData){
    try {
      const response = await axios.post(`${urlBase}/api/delivery/deliver`, formData,
          {headers: {
            'Content-Type': 'multipart/form-data'
        }});
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async deliverOld(commentaire, type_livraison_id, user_id, isAncienne, date_livraison, nom_livreur, nom_validateur, produitsLivre){
    try {
      const response = await axios.post(`${urlBase}/api/delivery/deliverOld`,
          {
          commentaire,
          type_livraison_id,
          user_id,
          isAncienne,
          date_livraison,
          nom_livreur,
          nom_validateur,
          produitsLivre});
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async getAllLivraisons(){
    try{
      const response = await axios.get(`${urlBase}/api/delivery/getAllLivraisons`)
      // console.log(response)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  };

  async getOneLivraison(id){
    try{
      const response = await axios.get(`${urlBase}/api/delivery/getOneLivraison/${id}`)
      // console.log(response)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  };

  async updateLivraison(id, produitsLivre, commentaire, statut_livraison, type_livraison_id, user_id){
    try{
      const response = await axios.put(`${urlBase}/api/delivery/updateLivraison/${id}`,
      {produitsLivre,
      commentaire,
      statut_livraison,
      type_livraison_id,
      user_id,
      });

      // console.log(response)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  };

  async deliverStock(formData){
    try {
      const response = await axios.post(`${urlBase}/api/delivery/deliverStock`, formData,
          {headers: {
            'Content-Type': 'multipart/form-data'
        }});
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async getAllTypeLivraisonCommerciale(){
    try{
      const response = await axios.get(`${urlBase}/api/delivery/getAllTypeLivraisonCommerciale`)
      // console.log(response)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  }

  async getAllStockDeliveries(){
    try{
      const response = await axios.get(`${urlBase}/api/delivery/getAllStockDeliveries`)
      // console.log(response)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  }

  async getOneLivraisonDemande(id){
    try{
      const response = await axios.get(`${urlBase}/api/delivery/getOneLivraisonDemande/${id}`)
      return response.data;
    } catch(error){
      throw error.response.data
    }
  }

  async receiveStock(formData){
    try {
      const response = await axios.post(`${urlBase}/api/delivery/receiveStock`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}