import {useState, useEffect} from "react";
import { Link } from "react-router";

import { ListIcon, CableDataIcon, PhoneSetting, BaseLinePhoneIcon } from "../../icons";
import 'primeicons/primeicons.css';

import ComponentCard from "../common/ComponentCard"
import { ProductDeliveries } from "../../backend/livraisons/productDeliveries"

export default function AllDeliveriesList() {

    const productDeliveries = new ProductDeliveries();
    const [deliveryForms, setDeliveryForms] = useState([]);
    const [loading, setLoading] = useState(false);


    const formatDate = (date) => {
        const d = new Date(date);
        return d.toLocaleDateString('fr-FR'); // or use any locale you want
      };

    useEffect( ()=>{
        const fetchDeliveryForms = async () =>{
            setLoading(true);
            try{
                let response = await productDeliveries.getAllLivraisons();
                console.log(response)
                setDeliveryForms(response)

            } catch(error){
                console.log('Error fetching data ',error)
            } finally{
                setLoading(false);
            }
        }; fetchDeliveryForms();
    },[])



    return(
        <>  
            {loading ? (<><span>Loading...</span></>) : (
                <div className="grid grid-cols-6 gap-5">
                    {deliveryForms.map((deliveryForm) => {
                        let title = '';
                        let typeColor = ''
                        let formDate = formatDate(deliveryForm.date_livraison)
                        if (deliveryForm.type_livraison_id === 2) {
                            title = 'TPE GIM';
                            typeColor = "text-sm font-medium text-cyan-700"
                        } else if (deliveryForm.type_livraison_id === 4) {
                            title = 'CHARGEUR'; // fallback or other types
                            typeColor = "text-sm font-medium text-stale-500"
                        } else{
                            title = 'AUTRE'
                            typeColor = "text-sm font-medium text-error-500"
                        }

                            return(
                            <>
                            <Link 
                                    key={deliveryForm.id_livraison} 
                                    to={`/formulaire/${deliveryForm.id_livraison}`} 
                                    className="col-span-1"
                                >
                                    <div className="border rounded p-1.5 bg-white relative hover:text-cyan-600 cursor-pointer"> 
                                        <div className="flex justify-between relative">
                                            <span className={typeColor}>{title}</span>
                                            <span className="absolute right-0.5 top-0.5"><i className="pi pi-clipboard"></i></span>
                                        </div>
                                        <div className="flex flex-col text-sm font-light">
                                            <span>{deliveryForm.qte_totale_livraison} produits</span>
                                            <span>{formDate}</span>
                                        </div>
                                        
                                    </div>
                                </Link>
                            </>
                        )
                    })}

                </div>
            )}
        </>
    )
}