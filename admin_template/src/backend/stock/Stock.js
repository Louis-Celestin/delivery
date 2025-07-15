import axios from "axios";
import urlBase from '../const';
import { ca } from "date-fns/locale";


export class Stock{

    async getAllStock(){
        try{
        const response = await axios.get(`${urlBase}/api/stock/getAllStock`)
        console.log(response)
        return response.data;
    } catch(error){
        throw error.response.data
    }
    };

    async setStock(piece_id, stock_initial, nouveau_stock, utilisateur_id){
        try{
            const response = await axios.put(`${urlBase}/api/stock/setStock`,
                {
                    piece_id,
                    stock_initial,
                    nouveau_stock,
                    utilisateur_id,
                }
            )
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

}
