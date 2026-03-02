import axios from "axios";
import urlBase from '../const';

export class DemandeQr {
    async getAllTypePaiement() {
        try {
            const response = await axios.get(`${urlBase}/api/demandeQr/getAllTypePaiement`)
            return response.data;
        } catch (error) {
            throw error.response.data
        }
    }

    async faireDemandeQr(payload) {
        try {
            const response = await axios.post(`${urlBase}/api/demandeQr/faireDemandeQr`, payload)
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    async getAllDemandesQr() {
        try {
            const response = await axios.get(`${urlBase}/api/demandeQr/getAllDemandesQr`)
            return response.data;
        } catch (error) {
            throw error.response.data
        }
    }

    async getOneDemandeQr(id) {
        try {
            const response = await axios.get(`${urlBase}/api/demandeQr/getOneDemandeQr/${id}`)
            return response.data;
        } catch (error) {
            throw error.response.data
        }
    };

}