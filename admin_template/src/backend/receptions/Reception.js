import axios from "axios";
import urlBase from '../const';


export class Reception{


    async receive(formData){
        try {
          const response = await axios.post(`${urlBase}/api/receive/receive`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }})
          console.log(response)
          return response.data;
        } catch (error) {
          throw error.response.data;
        }
    };

}