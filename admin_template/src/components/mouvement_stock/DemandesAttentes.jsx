import { useEffect, useState } from "react"
import { InfoIcon, ReceiveBoxIcon, PaperPlaneIcon, RefreshTimeIcon, ClipboardCheck, SimpleInfo } from "../../icons"

import { Demandes } from "../../backend/demandes/Demandes"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function DemandesAttentes() {

    const demandes = new Demandes
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchDemandesAttentes = async () =>{
            try{
                setLoading(true);

                let data = await demandes.getAllDemandes()

                const demandesAttentes = data.filter(item => {
                    return item.statut_demande === "en_cours";
                });
                setCount(demandesAttentes.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchDemandesAttentes();
    },[]);
    return (
        <>
            <div className="border rounded-md border-l-8 border-yellow-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex justify-between text-yellow-500 items-center border-b pb-3 mb-3">
                        <span>Demandes en attente</span>
                        <span className="text-title-sm"><SimpleInfo /></span>
                    </div>
                    <div className="flex text-yellow-500 justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                            <span className="text-title-sm text-yellow-300"><ClipboardCheck /></span>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}