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

    async getUserRoles(id){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getUserRoles/${id}`)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async getAllUserRoles(){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getAllUserRoles`)
            console.log("USER ROLES : ",response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async getAllRoles(){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getAllRoles`)
            console.log("ROLES : ",response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async getAllServices(){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getAllServices`)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async getAllUserServices(){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getAllUserServices`)
            console.log("USER SERVICES : ",response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async getOneUser(id){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getOneUser/${id}`)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async register(payload){
        try{
            const response = await axios.post(`${urlBase}/api/auth/register`, payload)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

    async getUserServices(id){
        try{
            const response = await axios.get(`${urlBase}/api/auth/getUserServices/${id}`)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    };

    async updateUser(id, payload){
        try{
            const response = await axios.put(`${urlBase}/api/auth/updateUser/${id}`, payload)
            console.log(response)
            return response.data;
        } catch(error){
            throw error.response.data
        }
    }

}
