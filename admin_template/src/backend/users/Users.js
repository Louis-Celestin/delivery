import axios from "axios";
import urlBase from '../const';


export class Users{

    async getAllUsers(){
        try{
        const response = await axios.get(`${urlBase}/api/auth/getAllUsers`)
        console.log(response)
        return response.data;
    } catch(error){
        throw error.response.data
    }
    };

}
