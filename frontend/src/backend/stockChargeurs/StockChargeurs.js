import axios from "axios";
import urlBase from '../const';


export class StockChargeurs{

    async entreeStock(qte, chargeur_id, user_id, type_transaction){
        try{
            const response = await axios.post(`${urlBase}/api/transaction/entreeStock`,
            {qte,
             chargeur_id,
             user_id,
             type_transaction       
            });
            console.log(response)
            return response.data
        } catch(error){
            throw error.response.data;
        }
    }
}
