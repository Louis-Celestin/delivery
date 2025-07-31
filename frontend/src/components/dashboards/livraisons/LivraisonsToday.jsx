import { useEffect, useState } from "react"
import {BaseLinePhoneIcon, PhoneSetting, CableDataIcon} from "../../../icons"

import { ProductDeliveries } from '../../../backend/livraisons/ProductDeliveries';
import { ProgressSpinner } from 'primereact/progressspinner';

import { isSameDay } from 'date-fns';

export default function LivraisonsToday() {

    const productDeliveries = new ProductDeliveries()
    const [loadingLivraison, setLoadingLivraison] = useState(false);

    const [livraisonGimToday, setLivraisonGimToday] = useState(0);
    const [livraisonMobileToday, setLivraisonMobileToday] = useState(0);
    const [livraisonMAJToday, setLivraisonMAJToday] = useState(0);
    const [livraisonEcobankToday, setLivraisonEcobankToday] = useState(0);
    const [livraisonRepareToday, setLivraisonRepareToday] = useState(0);
    const [livraisonChargeurToday, setLivraisonChargeurToday] = useState(0);

    const [TPEGimToday, setTPEGimToday] = useState(0);
    const [TPEMobileToday, setTPEMobileToday] = useState(0);
    const [TPEMAJToday, setTPEMAJToday] = useState(0);
    const [TPEEcobankToday, setTPEEcobankToday] = useState(0);
    const [TPERepareToday, setTPERepareToday] = useState(0);
    const [chargeurToday, setChargeurToday] = useState(0);

    useEffect( ()=>{
        const fetchLivraisonsToday = async () =>{
            try{
                setLoadingLivraison(true);
                let data;
                data = await productDeliveries.getAllLivraisons()
                const today = new Date();

                const gimToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 1;
                })
                setLivraisonGimToday(gimToday.length)

                const mobileToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 4;
                })
                setLivraisonMobileToday(mobileToday.length)

                const majGimToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 3;
                })
                setLivraisonMAJToday(majGimToday.length)

                const ecobankToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 6;
                })
                setLivraisonEcobankToday(ecobankToday.length)

                const repareToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 2;
                })
                setLivraisonRepareToday(repareToday.length)

                const chargeurToday = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return isSameDay(deliveryDate, today) &&
                    item.statut_livraison === "livre" &&
                    item.type_livraison_id === 5;
                })
                setLivraisonChargeurToday(chargeurToday.length)

                const nbeTPE = data.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return  isSameDay(deliveryDate, today) &&
                            item.statut_livraison === 'livre';
                });

                const sums = {
                    1: 0, // TPE GIM
                    2: 0, // TPE REPARE
                    3: 0, // TPE MAJ
                    4: 0, // TPE MOBILE
                    5: 0,  // CHARGEUR
                    6: 0, // TPE ECOBANK
                };

                nbeTPE.forEach(item => {
                    const type = item.type_livraison_id;
                    if (sums[type] !== undefined) {
                        sums[type] += Number(item.qte_totale_livraison || 0);
                    }
                });

                setTPEGimToday(sums[1]);
                setTPERepareToday(sums[2]);
                setTPEMAJToday(sums[3]);
                setTPEMAJToday(sums[4]);
                setChargeurToday(sums[5]);
                setTPEEcobankToday(sums[6]);
                
            }catch(error){
                console.error("Error fetching today's livraisons:", error);
            }finally {
            setLoadingLivraison(false);
            }
        }; fetchLivraisonsToday();
    },[]);
    return (    
        <>
            <div>
                <div>
                    <div>
                        <div className="w-1/10 text-center text-xs bg-green-400 text-white">
                            Chiffres du jour
                        </div>
                    </div>
                    <div className="border rounded-tr-2xl">
                        <div className="mb-2 pl-2">
                            <span>
                                Livraisons TPE
                            </span>
                        </div>
                        <div className="grid grid-cols-5 bg-white">
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-purple-400">Livraison GIM</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-purple-300"><BaseLinePhoneIcon /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonGimToday}</div>
                                                <div>Total produits : {TPEGimToday}</div>
                                            </div>
                                        </div>
                                    </>
                                ) } 
                            </div>
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-purple-600">Livraison MAJ GIM</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-purple-600"><BaseLinePhoneIcon /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonMAJToday}</div>
                                                <div>Total produits : {TPEMAJToday}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-green-300">Livraison MOBILE</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-green-300"><BaseLinePhoneIcon /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonMobileToday}</div>
                                                <div>Total produits : {TPEMobileToday}</div>
                                            </div>
                                        </div>
                                    </>
                                )} 
                            </div>
                            
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-cyan-400">Livraison ECOBANK</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-cyan-300"><BaseLinePhoneIcon /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonEcobankToday}</div>
                                                <div>Total produits : {TPEEcobankToday}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-red-400">Livraison TPE REPARE</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-red-400"><PhoneSetting /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonRepareToday}</div>
                                                <div>Total produits : {TPERepareToday}</div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="border border-t-0">
                        <div className="mb-2 pt-2 pl-2">
                            <span>
                                Livraisons autres
                            </span>
                        </div>
                        <div className="grid grid-cols-5 bg-white">
                            <div className="p-2 border-r border-gray-100">
                                <span className="text-yellow-400">Livraison chargeur</span>
                                {loadingLivraison ? 
                                (<>
                                    <div className="flex items-center justify-center">
                                        <ProgressSpinner style={{width: '30px', height: '30px'}} strokeWidth="8" animationDuration=".5s" />
                                    </div>
                                </>) :
                                (
                                    <>
                                        <div className="flex items-center">
                                            <span className="text-4xl text-yellow-300"><CableDataIcon /></span>
                                            <div className="text-sm text-gray-600 font-medium">
                                                <div>Total Livraison : {livraisonChargeurToday}</div>
                                                <div>Total produits : {chargeurToday}</div>
                                            </div>
                                        </div>
                                    </>
                                ) } 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}