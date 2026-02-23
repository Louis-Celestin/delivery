import axios from "axios";
import urlBase from '../const';

export class Demandes {
  async faireDemande(formData) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/faireDemande`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data
    } catch (error) {
      throw error.response.data;
    }
  }

  async getAllDemandes() {
    try {
      const response = await axios.get(`${urlBase}/api/demandes/getAllDemandes`)
      return response.data;
    } catch (error) {
      throw error.response.data
    }
  };

  async getOneDemande(id) {
    try {
      const response = await axios.get(`${urlBase}/api/demandes/getOneDemande/${id}`)
      // console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data
    }
  };

  async validateDemande(payload) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/validateDemande`, payload)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async preValidateDemande(formData) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/preValidateDemande`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async returnDemande(payload) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/returnDemande`, payload)
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async cancelDemande(payload) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/cancelDemande`, payload)
      console.log(response)
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  };

  async updateDemande(id, payload) {
    try {
      const response = await axios.put(`${urlBase}/api/demandes/updateDemande/${id}`, payload)
      return response.data;
    } catch (error) {
      throw error.response.data
    }
  };

  async getPdf(idDemande) {
    try {
      const response = await axios.get(`${urlBase}/api/demandes/getPdf/${idDemande}`, {
        responseType: 'blob', // important!
      });
      console.log(response)

      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }

  async receivePiece(formData) {
    try {
      const response = await axios.post(`${urlBase}/api/demandes/receivePiece`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  }
}

