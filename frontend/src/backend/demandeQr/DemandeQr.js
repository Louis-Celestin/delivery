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

    async uploadDemandeQr(id, formData) {
        try {
            const response = await axios.put(`${urlBase}/api/demandeQr/uploadDemandeQr/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data
        } catch (error) {
            throw error.response.data;
        }
    }

    async downloadQrCodes(idDemande, idGeneration) {
        try {
            const response = await axios.get(`${urlBase}/api/demandeQr/downloadQrCodes/${idDemande}/${idGeneration}`,
                {
                    responseType: "blob",
                }
            );
            return response;
        } catch (error) {
            throw error.response?.data || { message: "Download failed" };
        }
    }

    async impressionDemandeQr(idDemande, idGeneration, payload) {
        try {
            const response = await axios.put(`${urlBase}/api/demandeQr/impressionDemandeQr/${idDemande}/${idGeneration}`, payload);
            return response;
        } catch (error) {
            throw error.response.data;
        }
    }

    async livraisonDemandeQr(idDemande, formData) {
        try {
            const response = await axios.put(`${urlBase}/api/demandeQr/livraisonDemandeQr/${idDemande}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    async receptionDemandeQr(idDemande, idLivraison, formData) {
        try {
            const response = await axios.put(`${urlBase}/api/demandeQr/receptionDemandeQr/${idDemande}/${idLivraison}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    }

    async getAllFormatsQr() {
        try {
            const response = await axios.get(`${urlBase}/api/demandeQr/getAllFormatsQr`)
            return response.data;
        } catch (error) {
            throw error.response.data
        }
    }
}