import axios from "axios";
import urlBase from '../const';

export class Demandes{
    async faireDemande(formData){
        try{
            const response = await axios.post(`${urlBase}/api/demandes/faireDemande`, formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            return response.data
        } catch (error){
            throw error.response.data;
        }
    }

    async getAllDemandes(){
        try{
        const response = await axios.get(`${urlBase}/api/demandes/getAllDemandes`)
        // console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };

    async getOneDemande(id){
      try{
        const response = await axios.get(`${urlBase}/api/demandes/getOneDemande/${id}`)
        // console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };

    async validateDemande(formData){
        try {
        const response = await axios.post(`${urlBase}/api/demandes/validateDemande`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }})
        console.log(response)
        return response.data;
        } catch (error) {
        throw error.response.data;
        }
    }

    async returnDemande(payload){
        try{
          const response = await axios.post(`${urlBase}/api/demandes/returnDemande`, payload)
          console.log(response)
            return response.data;
        } catch (error) {
          throw error.response.data;
        }
    };

    async cancelDemande(demande_id, commentaire_refus, user_id, type_demande_id){
        try{
          const response = await axios.post(`${urlBase}/api/demandes/cancelDemande`,
            {
              demande_id,
              commentaire_refus,
              user_id,
              type_demande_id,
            }
          )
          console.log(response)
            return response.data;
        } catch (error) {
          throw error.response.data;
        }
    };

    async updateDemande(payload){
      try{
        const response = await axios.put(`${urlBase}/api/demandes/updateDemande/${id}`, payload)
        // console.log(response)
        return response.data;
      } catch(error){
        throw error.response.data
      }
    };

    async getPdf(idDemande){
        try{
            const response = await axios.get(`${urlBase}/api/demandes/getPdf/${idDemande}`, {
                responseType: 'blob', // important!
            });
            console.log(response)
    
            return response.data;
        }catch(error){
            throw error.response.data;
        }
    }
}

