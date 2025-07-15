import axios from "axios";
import urlBase from '../const';


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

}
