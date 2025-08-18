import React, { useState, useEffect } from "react"
import { ProductDeliveries } from "../../backend/livraisons/ProductDeliveries.js";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function LivraisonsTableData() {

    const deliveryData = new ProductDeliveries()
    
    const [loading, setLoading] = useState(false)
    const [listeLivraisons, setListeLivraisons] = useState([])
    const [typesLivraison, setTypesLivraison] = useState([])

    useEffect( () =>{
        const fetchDeliveriesData = async () =>{
            try{
                setLoading(true)
                const deliveries_data = await deliveryData.getAllLivraisons()
                setListeLivraisons(deliveries_data)

                const typesLivraison_data = await deliveryData.getAllTypeLivraisonCommerciale()
                setTypesLivraison(typesLivraison_data)

            } catch(error){
                console.log('Error component livraison : ', error)
            } finally{
                setLoading(false)
            }
        }
        fetchDeliveriesData()
    },[])

    const sumLivraison = (typeID) => {
        // Filter by date & statut 'livré'
        const filtered = listeLivraisons.filter(item => {
            if (item.statut_livraison !== 'livre') return false;

            // Safely get the last validation date
            if (!item.validations || item.validations.length === 0) return false;
            const lastValidation = item.validations[item.validations.length - 1];
            const deliveryDate = new Date(lastValidation.date_validation);

            return deliveryDate >= startDate && deliveryDate <= endDate;
        });

        // Sum quantities for the requested type
        const total = filtered
            .filter(item => item.type_livraison_id === typeID)
            .reduce((sum, item) => sum + Number(item.qte_totale_livraison || 0), 0);

        return total;
    };


    return (
        <>
            
        </>
    )
}