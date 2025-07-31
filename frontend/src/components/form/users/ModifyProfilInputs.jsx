import { useEffect, useState, useRef, use } from "react";
import { useNavigate, useParams } from "react-router";
import ComponentCard from "../../common/ComponentCard.tsx";
import Label from "../Label.tsx";
import Input from "../input/InputField.tsx";
import Checkbox from "../input/Checkbox";
import Select from "../Select.tsx";

import { Users } from "../../../backend/users/Users.js";

export default function ModifyProfilInputs() {

    const { id } = useParams();
    const userData = new Users()
    const [loadingUser, setLoadingUser] = useState(false)
    const [errorForm, setErrorForm] = useState('')
    const [user, setUser] = useState()
    const [nomUser, setNomUser] = useState('')

    useEffect( ()=>{
        const fetchUserInfos = async () => {
            try{
                setLoadingUser(true);
                const user_data = await userData.getOneUser(id)
                console.log(user_data)
                setUser(user_data)
                setNomUser(user_data.username.toUpperCase().replace("."," "))
            } catch(error){
                console.log("Erreur lors de la récupération des données : ",error)
            } finally{
                setLoadingUser(false)
            }
        }
        fetchUserInfos();
    },[])
    return (
        <>
            <div className="flex justify-center mb-6">
                {loadingUser ? (<>Loading...</>) : 
                    (
                        errorForm ? (
                            <div className="text-error-600 bg-error-300 font-medium flex items-center justify-center rounded-3xl text-sm p-4">
                                {errorForm}
                            </div>
                            ) : (
                                    <>
                                        <ComponentCard className="md:w-1/2 w-full" title={`Modifier profil ${nomUser}`}></ComponentCard>
                                    </>
                                )
                    )
                }
            </div>
        </>
    )
}