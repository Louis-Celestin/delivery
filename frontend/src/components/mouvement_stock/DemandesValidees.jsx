import { useEffect, useState } from "react"
import { InfoIcon, ReceiveBoxIcon, PaperPlaneIcon, RefreshTimeIcon, ClipboardCheck, CheckSimple } from "../../icons"

import { Demandes } from "../../backend/demandes/Demandes"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { ProgressSpinner } from 'primereact/progressspinner';


export default function DemandesValidees({ startDate, endDate }) {

    const demandes = new Demandes
    const [loading, setLoading] = useState(false)
    const [count, setCount] = useState(0);

    useEffect( () =>{
        const fetchDemandesValidees = async () =>{
            try{
                setLoading(true);

                let data = await demandes.getAllDemandes()
                console.log(data)
                const demandesValidees = data.filter(item => {
                    let demandeDate = item.date_demande
                    if (item.validation_demande.length > 0){
                        let index = item.validation_demande.length-1
                        demandeDate = new Date(item.validation_demande[index].date_validation_demande);
                    }
                    console.log("Date validation :", demandeDate)
                    return item.statut_demande === "valide" && 
                        demandeDate >= startDate && 
                        demandeDate <= endDate;
                });
                setCount(demandesValidees.length);
                console.log("DEMANDES VALIDEES : ", demandesValidees.length)
            } catch(error){
                console.log(error)
            } finally{
                setLoading(false)
            }
        }; fetchDemandesValidees();
    },[startDate,endDate]);
    return (
        <>
            <div className="border rounded-md border-l-8 border-blue-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div>
                    <div className="flex justify-between text-blue-500 items-center border-b pb-3 mb-3">
                        <span>Demandes validées</span>
                        <span className="text-title-sm"><CheckSimple /></span>
                    </div>
                    <div className="flex text-blue-500 justify-between items-center text-title-md">
                        <>
                            {loading ? 
                                (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                (<span>{count}</span>)
                            }
                            <span className="text-title-sm text-blue-300"><ClipboardCheck /></span>
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}