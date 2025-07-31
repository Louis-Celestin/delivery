import { useEffect, useState } from "react"
import { CableDataIcon, ReturnArrow } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function ChargeursReturn({ startDate, endDate }) {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchChargeursReturn = async () =>{
            try{
                setLoading(true);
                // const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
                // const endDate = endOfWeek(new Date(), { weekStartsOn: 1 });

                let data = await delivery.getAllLivraisons()

                const chargeursReturn = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.statut_livraison === "en_attente" &&
                            item.type_livraison_id === 5;
                });
                let sum = 0;
                chargeursReturn.forEach(item => {
                    sum += Number(item.qte_totale_livraison || 0);
                });
                setCount(sum);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchChargeursReturn();
    },[startDate,endDate]);
    return (
        <>
            <div className="rounded-2xl border border-gray-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span className="text-gray-500"><CableDataIcon /></span>
                        <span>Chargeurs Retournés</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                        </>
                        <span className="text-gray-400"><ReturnArrow /></span>
                    </div>
                </div>
            </div>
        </>
    )
}