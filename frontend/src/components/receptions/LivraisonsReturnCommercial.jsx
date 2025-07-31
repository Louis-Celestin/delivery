import { useEffect, useState } from "react"
import { ErrorHexaIcon, ReturnArrow } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function LivraisonReturnCommercial({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchLivraisonsReturn = async () =>{
            try{
                setLoading(true);
                // const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                // const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

                let data = await delivery.getAllLivraisons()

                const livraisonsReturn = data.filter(item => {
                    let deliveryDate = new Date(item.date_livraison)
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id !== 7 &&
                            item.type_livraison_id !== 8 &&
                            item.statut_livraison === "en_attente";
                });
                setCount(livraisonsReturn.length);
                console.log("date début : ",startDate)
                console.log("date fin : ",endDate)
                console.log("Livraisons retournées : ",livraisonsReturn)
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsReturn();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-red-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><ErrorHexaIcon /></span>
                        <span>Livraisons Retournées</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-red-400"><ReturnArrow /></span>
                    </div>
                </div>
            </div>
        </>
    )
}