import axios from "axios";
import urlBase from '../const';

export class Stock{

    async getAllStock(){
        try{
            const response = await axios.get(`${urlBase}/api/stock/getAllStock`)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async setStock(piece_id, payload){
        try{
            const response = await axios.put(`${urlBase}/api/stock/setStock/${piece_id}`, payload)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async getAllModels(){
        try{
            const response = await axios.get(`${urlBase}/api/stock/getAllModels`)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async addPiece(payload){
        try{
            const response = await axios.post(`${urlBase}/api/stock/addPiece`, payload)
            return response.data
        } catch(error){
            throw error.response.data
        }
    }

    async getAllMouvementStock(){
        try{
            const response = await axios.get(`${urlBase}/api/stock/getAllMouvementStock`)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async getPiece(id){
        try{
            const response = await axios.get(`${urlBase}/api/stock/getPiece/${id}`)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async modifyPiece(id, payload){
        try{
            const response = await axios.put(`${urlBase}/api/stock/modifyPiece/${id}`, payload)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };
}
