import axios from "axios";
import urlBase from '../const';


export class Merchants {

    async findMerchant() {
        try {
            const response = await axios.get(`${urlBase}/api/merchants/findMerchant`);
            console.log(response)
            return response.data;
          } catch (error) {
            throw error.response.data;
          }
    }
}
