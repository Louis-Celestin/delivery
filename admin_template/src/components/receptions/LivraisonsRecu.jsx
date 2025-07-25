import { useEffect, useState } from "react"
import { InfoIcon, ReceiveBoxIcon } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function LivraisonsRecu({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchLivraisonsRecues = async () =>{
            try{
                setLoading(true);
                // const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                // const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

                let data = await delivery.getAllLivraisons()

                const livraisonsRecues = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    const isCommercial = item.type_livraison_id != 7 && item.type_livraison_id != 8;
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            isCommercial &&
                            item.statut_livraison === "livre";
                });
                console.log(livraisonsRecues)
                setCount(livraisonsRecues.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsRecues();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-blue-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><InfoIcon /></span>
                        <span>Livraisons Reçues</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-blue-400"><ReceiveBoxIcon /></span>
                    </div>
                </div>
            </div>
        </>
    )
}