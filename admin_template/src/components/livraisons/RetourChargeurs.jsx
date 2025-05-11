import { useState, useEffect } from "react";

import { StatsLivraisons } from "../../backend/livraisons/StatsLivraisons";

import {
    BaseLinePhoneIcon,
    CableDataIcon,
}from "../../icons";


export default function RetourChargeurs() {

    const statsLivraisons = new StatsLivraisons()
    const [nbrChargeurRetour, setNbrChargeurRetour] = useState('0');
    const [loading, setLoading] = useState(false)

    useEffect( ()=> {
        const fetchStockDetails = async () =>{
            try{
                setLoading(true)
                let data;
                let id = window.sessionStorage.getItem("id")
                console.log('id utilisateur : ', id)
                data = await statsLivraisons.nbreturncharger(id)
                console.log(data)
                setNbrChargeurRetour(data.nbreturncharger);
            } catch(error){
                console.log("Error fetchind data ", error)
            } finally{
                setLoading(false)
            }
        }; fetchStockDetails();
    },[]);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-light text-gray-800 dark:text-white/90">
                        Chargeurs retournés
                    </h3>
                    <span className="text-3xl p-1 rounded-xl bg-red-300 ">
                        <CableDataIcon />
                    </span>
                </div>
                <div>
                    <span className="text-3xl font-bold my-3 dark:text-white">{nbrChargeurRetour}</span>
                </div>
            </div>

        </div>
    )

}