import axios from "axios";
import urlBase from '../const';


export class StatsLivraisons{

    async nbdeliverycharger(user_id){
        try{
            const response = await axios.get(`${urlBase}/api/stats/nbdeliverycharger`, {user_id});
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data;
        }
    };

}