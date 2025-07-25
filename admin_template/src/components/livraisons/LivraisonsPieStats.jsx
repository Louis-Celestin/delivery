import React, { useState, useEffect } from "react"

import { ProductDeliveries } from "../../backend/livraisons/ProductDeliveries.js";
import { Chart } from 'primereact/chart';
import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";
import { ListIcon, CableDataIcon, PhoneSetting } from "../../icons/index.ts";
import { ProgressSpinner } from 'primereact/progressspinner';

export default function LivraisonsPieStats({ startDate, endDate }) {

    const productDeliveries = new ProductDeliveries();
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    // const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
    // const endDate = endOfWeek(new Date(), { weekStartsOn: 1 })
    const [loading, setLoading] = useState(false);

    const [tpeGIM, setTPEGIM] = useState(0)
    const [tpeMobile, setTPEMobile] = useState(0)
    const [tpeMAJ, setTPEMAJ] = useState(0)
    const [tpeRepare, setTPERepare] = useState(0)
    const [chargeurs, setChargeurs] = useState(0)
    const [tpeEcobank, setTPEEcobank] = useState(0)
    const [chargeursDecom, setChargeursDecom] = useState(0)

    useEffect(() => {
        const fetchStatsTPE = async () =>{
            if (!startDate || !endDate) return;
            setLoading(true);

            try{
                setLoading(true)
                const allData = await productDeliveries.getAllLivraisons();
                // console.log(allData)

                const livraisonGIM = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 1 &&
                            item.statut_livraison === 'livre';
                });
                console.log(livraisonGIM)
                setTPEGIM(livraisonGIM.length)

                const livraisonRepare = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 2 &&
                            item.statut_livraison === 'livre';
                });
                setTPERepare(livraisonRepare.length)

                const livraisonMAJ = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 3 &&
                            item.statut_livraison === 'livre';
                });
                setTPEMAJ(livraisonMAJ.length)

                const livraisonMobile = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 4 &&
                            item.statut_livraison === 'livre';
                });
                setTPEMobile(livraisonMobile.length)

                const livraisonChargeurDecom = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 8 &&
                            item.statut_livraison === 'livre';
                });
                setChargeursDecom(livraisonChargeurDecom.length)

                const livraisonEcobank = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.type_livraison_id === 6 &&
                            item.statut_livraison === 'livre';
                });
                setTPEEcobank(livraisonEcobank.length)

                const livraisonChargeur = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        let index = item.validations.length-1
                        deliveryDate = new Date(item.validations[index].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            (item.type_livraison_id === 5 ||
                            item.type_livraison_id === 7) &&
                            item.statut_livraison === 'livre';
                });
                setChargeurs(livraisonChargeur.length)

                const piedata = {
                    labels: ['TPE GIM', 'TPE MOBILE', 'TPE REPARE', 'TPE MAJ','TPE ECOBANK', 'CHARGEURS', 'CHARGEURS DECOM'],
                    datasets: [
                        {
                            data: [livraisonGIM.length, livraisonMobile.length, livraisonRepare.length, livraisonMAJ.length, livraisonEcobank.length, livraisonChargeur.length, livraisonChargeurDecom.length],
                            // datacharts: [100, 23, 34, 200],
                            backgroundColor: [
                                'rgba(217, 135, 255, 0.5)', 
                                'rgba(109, 199, 105, 0.62)', 
                                'rgba(176, 84, 86, 0.5)',
                                'rgba(143, 105, 199, 0.62)',
                                'rgba(105, 201, 207, 0.62)',
                                'rgba(212, 212, 89, 0.62)',
                                'rgba(212, 141, 19, 0.5)',
                            ],
                            hoverBackgroundColor: [
                                'rgba(0, 0, 0, 1)', 
                                'rgba(0, 0, 0, 1)', 
                                'rgba(0, 0, 0, 1)',
                                'rgba(0, 0, 0, 1)',
                                'rgba(0, 0, 0, 1)',
                                'rgba(0, 0, 0, 1)',
                                'rgba(0, 0, 0, 1)',
                            ]
                        }
                    ]
                }
                const options = {
                    plugins: {
                        legend: {
                            labels: {
                                usePointStyle: true
                            }
                        }
                    }
                };
        
                setChartData(piedata);
                setChartOptions(options);
            } catch(error){
                console.log("Error fetchind data ", error)
            } finally{
                setLoading(false)
            }
        }; fetchStatsTPE();
    }, [startDate,endDate]);
    return (
        <>
            <div className="grid grid-cols-1">
                <div className="rounded-2xl border border-gray-200 bg-white pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800 dark:text-white">
                    <div className="flex flex-col items-center justify-center">
                        <div className="mb-4 px-3 pb-1.5 w-full border-b flex justify-between items-center">
                            <span className="font-light">Ensemble des livraisons par type</span>
                            <span className="p-2 bg-brand-100 rounded-2xl text-2xl"><ListIcon /></span>
                        </div>
                        <>    
                            {loading ? (
                                <ProgressSpinner />
                            ) : (
                                <div className="card flex justify-content-center items-center">
                                    <div>
                                        <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                                    </div>
                                    <div>
                                        <div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-purple-100 text-purple-400 font-bold">TPE GIM</span>
                                                <span> : {tpeGIM}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-green-200 text-green-600 font-bold">TPE Mobile</span>
                                                <span> : {tpeMobile}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-red-200 text-red-600 font-bold">TPE réparé</span>
                                                <span> : {tpeRepare}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-purple-200 text-purple-600 font-bold">TPE MAJ</span>
                                                <span> : {tpeMAJ}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-cyan-200 text-cyan-600 font-bold">TPE Ecobank</span>
                                                <span> : {tpeEcobank}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-yellow-200 text-yellow-600 font-bold">Chargeurs</span>
                                                <span> : {chargeurs}</span>
                                            </div>
                                            <div className="my-1">
                                                <span className="p-1 text-sm rounded-3xl bg-orange-200 text-orange-600 font-bold">Chargeurs DECO</span>
                                                <span> : {chargeursDecom}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    </div>
                </div>
            </div>
        </>
    )
}