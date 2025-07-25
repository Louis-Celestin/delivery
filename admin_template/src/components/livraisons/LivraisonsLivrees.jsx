import { useEffect, useState } from "react"
import { InfoIcon, ReceiveBoxIcon, PaperPlaneIcon } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function LivraisonsLivrees({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchLivraisonsLivrees = async () =>{
            try{
                setLoading(true);
                // const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                // const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

                let data = await delivery.getAllLivraisons()

                const livraisonsLivrees = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.statut_livraison === "livre";
                });
                setCount(livraisonsLivrees.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsLivrees();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-blue-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><InfoIcon /></span>
                        <span>Livraisons Effectuées</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-blue-400"><PaperPlaneIcon /></span>
                    </div>
                </div>
            </div>
        </>
    )
}