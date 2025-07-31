import { useEffect, useState } from "react"
import { ReturnArrow, ClipboardCheck, CloseIcon } from "../../icons"

import { Demandes } from "../../backend/demandes/Demandes"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function DemandesCancelSupport({ startDate, endDate }) {

    const demandes = new Demandes
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchDemandeRefusees = async () =>{
            try{
                setLoading(true);

                let data = await demandes.getAllDemandes()

                const demandesRefusees = data.filter(item => {
                    let demandeDate = item.date_demande
                    if (item.validation_demande.length > 0){
                        demandeDate = new Date(item.validation_demande[0].date_validation_demande);
                    }

                    return item.statut_demande === "refuse" && 
                    item.type_demande_id == 1 &&
                    demandeDate >= startDate && 
                    demandeDate <= endDate;
                });
                setCount(demandesRefusees.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchDemandeRefusees();
    },[startDate,endDate]);
    return (
        <>
            <div className="border rounded-md border-l-8 border-gray-dark bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex justify-between text-gray-dark items-center border-b pb-3 mb-3">
                        <span>Demandes refusées</span>
                        <span className="text-title-sm"><CloseIcon /></span>
                    </div>
                    <div className="flex text-gray-dark justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                            <span className="text-title-sm text-gray-dark"><ClipboardCheck /></span>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}