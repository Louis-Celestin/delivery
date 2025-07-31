import { useEffect, useState } from "react"
import { MaintenanceCircle, PhoneSetting } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"

import { ProgressSpinner } from 'primereact/progressspinner';


export default function LivraisonsTPERepare({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);


    useEffect( () =>{
        const fetchLivraisonsTPERepare = async () =>{
            try{
                setLoading(true)
                let data = await delivery.getAllLivraisons()

                const livraisonsTPERepare = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.statut_livraison === "livre" &&
                            item.type_livraison_id === 2;
                });
                setCount(livraisonsTPERepare.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsTPERepare();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-slate-400  bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><MaintenanceCircle /></span>
                        <span>Livraisons TPE réparés</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-slate-500"><PhoneSetting /></span>
                    </div>
                </div>
            </div>
        </>
    )
}