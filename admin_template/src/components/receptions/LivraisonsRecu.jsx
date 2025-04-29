import { useEffect, useState } from "react"
import { InfoIcon, ReceiveBoxIcon } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"


export default function LivraisonsRecu() {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);


    useEffect( () =>{
        const fetchLivraisonsAttente = async () =>{
            try{
                let data = await delivery.getAllLivraisons()

                const livraisonsRecu = data.filter(
                    data => data.statut_livraison === "livre"
                );
                setCount(livraisonsRecu.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsAttente();
    },[]);
    return (
        <>
            <div className="rounded-2xl border border-blue-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><InfoIcon /></span>
                        <span>Livraisons Reçues</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <span>{count}</span> {/*Place to show the number of instance*/}
                        <span className="text-blue-400"><ReceiveBoxIcon /></span>
                    </div>
                </div>
            </div>
        </>
    )
}