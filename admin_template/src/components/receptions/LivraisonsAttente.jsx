import { useEffect, useState } from "react"
import { AlertIcon, TransferIcon } from "../../icons"

import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"


export default function LivraisonsAttente() {

    const delivery = new ProductDeliveries()
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);


    useEffect( () =>{
        const fetchLivraisonsAttente = async () =>{
            try{
                let data = await delivery.getAllLivraisons()

                const livraisonsAttente = data.filter(
                    data => data.statut_livraison === "en_cours"
                );
                setCount(livraisonsAttente.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchLivraisonsAttente();
    },[]);
    return (
        <>
            <div className="rounded-2xl border border-warning-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex items-center border-b pb-3 mb-3">
                        <span><AlertIcon /></span>
                        <span>Livraisons en attente</span>
                    </div>
                    <div className="flex justify-between items-center text-title-md">
                        <span>{count}</span> {/*Place to show the number of instance*/}
                        <span className="text-warning-400"><TransferIcon /></span>
                    </div>
                </div>
            </div>
        </>
    )
}