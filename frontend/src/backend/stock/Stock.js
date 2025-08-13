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

    async setStock(payload){
        try{
            const response = await axios.put(`${urlBase}/api/stock/setStock`,payload)
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

}
