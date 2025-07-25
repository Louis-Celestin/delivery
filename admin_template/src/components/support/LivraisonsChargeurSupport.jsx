import { useEffect, useState } from "react"
import { SimpleInfo, CableDataIcon } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"

import { ProgressSpinner } from 'primereact/progressspinner';


export default function LivraisonsChargeurSupport({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);


    useEffect( () =>{
        const fetchLivraisonsChargeur = async () =>{
            try{
                setLoading(true)
                let data = await delivery.getAllLivraisons()

                const livraisonsChargeur = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = deliveryForms.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.statut_livraison === "livre" &&
                            item.type_livraison_id === 8;
                });
                setCount(livraisonsChargeur.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsChargeur();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-emerald-400  bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span className="text-emerald-500"><SimpleInfo /></span>
                        <span>Livraisons Chargeurs</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-emerald-500"><CableDataIcon /></span>
                    </div>
                </div>
            </div>
        </>
    )
}