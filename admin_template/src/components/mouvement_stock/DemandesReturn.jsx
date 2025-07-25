import { useEffect, useState } from "react"
import { ReturnArrow, ClipboardCheck, CheckSimple } from "../../icons"

import { Demandes } from "../../backend/demandes/Demandes"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function DemandesReturn({ startDate, endDate }) {

    const demandes = new Demandes
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchDemandesRetournees = async () =>{
            try{
                setLoading(true);

                let data = await demandes.getAllDemandes()

                const demandesRetournees = data.filter(item => {
                    let demandeDate = item.date_demande
                    if (item.validation_demande.length > 0){
                        let index = item.validation_demande.length-1
                        demandeDate = new Date(item.validation_demande[index].date_validation_demande);
                    }

                    return item.statut_demande === "retourne" && 
                    demandeDate >= startDate && 
                    demandeDate <= endDate;
                });
                setCount(demandesRetournees.length);
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchDemandesRetournees();
    },[startDate,endDate]);
    return (
        <>
            <div className="border rounded-md border-l-8 border-red-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex justify-between text-red-500 items-center border-b pb-3 mb-3">
                        <span>Demandes retournées</span>
                        <span className="text-title-sm"><ReturnArrow /></span>
                    </div>
                    <div className="flex text-red-500 justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                            <span className="text-title-sm text-red-300"><ClipboardCheck /></span>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}