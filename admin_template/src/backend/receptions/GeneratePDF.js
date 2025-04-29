import axios from "axios";
import urlBase from '../const';


export const generatePdf = async (id_livraison) =>{
    try{
        const response = await axios.get(`http://172.31.1.78:5500/api/delivery/pdf/${id_livraison}`, {
            responseType: 'blob', // important!
        });
        console.log(response)

        return response.data;
    }catch(error){
        throw error.response.data;
    }
}