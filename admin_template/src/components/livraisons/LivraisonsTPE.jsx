import React, { useState, useEffect } from "react"

import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';
import { BaseLinePhoneIcon } from "../../icons";

import { StatsLivraisons } from "../../backend/livraisons/StatsLivraisons";

export default function LivraisonsTPE() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(false);
    const [tpeGIM, setTPEGIM] = useState('0')
    const [tpeMobile, setTPEMobile] = useState('0')
    const [tpeMAJ, setTPEMAJ] = useState('0')
    const [tpeRepare, setTPERepare] = useState('0')

    const statsLivraisons = new StatsLivraisons();

    useEffect(() => {

        const fetchStatsTPE = async () =>{
            try{
                setLoading(true)
                let data;
                let id = window.sessionStorage.getItem("id")
                console.log('id utilisateur : ', id)
                data = await statsLivraisons.nblivraisonpartype(id)
                console.log(data)
                console.log(data.nblivraisonpartype.nblivraisontpegim)
                setTPEGIM(data.nblivraisonpartype.nblivraisontpegim)
                setTPEMobile(data.nblivraisonpartype.nblivraisontpemobile)
                setTPERepare(data.nblivraisonpartype.livraisontperepare)
                setTPEMAJ(data.nblivraisonpartype.livraisontpemaj)
                const piedata = {
                    labels: ['TPE GIM', 'TPE MOBILE', 'TPE REPARE', 'TPE MAJ'],
                    datasets: [
                        {
                            data: [data.nblivraisonpartype.nblivraisontpegim, data.nblivraisonpartype.nblivraisontpemobile, data.nblivraisonpartype.livraisontperepare, data.nblivraisonpartype.livraisontpemaj],
                            // datacharts: [100, 23, 34, 200],
                            backgroundColor: [
                                'rgba(95, 199, 93, 0.5)', 
                                'rgba(84, 176, 158, 0.5)', 
                                'rgba(176, 84, 86, 0.5)',
                                'rgba(176, 162, 84, 0.5)',
                            ],
                            hoverBackgroundColor: [
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
    }, []);

    return (
        <>
            <div className="rounded-2xl border border-gray-200 bg-white pb-3 pt-4 dark:border-gray-800">
                <div className="flex flex-col items-center justify-center">
                    <div className="mb-4 px-3 pb-1.5 w-full border-b flex justify-between items-center">
                        <span className="font-light">Ensemble des livraisons de TPE par type</span>
                        <span className="p-2 bg-brand-100 rounded-2xl text-3xl"><BaseLinePhoneIcon /></span>
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
                                            <span className="p-1 text-sm rounded-3xl bg-green-200 text-green-600 font-bold">TPE GIM</span>
                                            <span> : {tpeGIM}</span>
                                        </div>
                                        <div className="my-1">
                                            <span className="p-1 text-sm rounded-3xl bg-cyan-200 text-cyan-600 font-bold">TPE Mobile</span>
                                            <span> : {tpeMobile}</span>
                                        </div>
                                        <div className="my-1">
                                            <span className="p-1 text-sm rounded-3xl bg-red-200 text-red-600 font-bold">TPE réparé</span>
                                            <span> : {tpeRepare}</span>
                                        </div>
                                        <div className="my-1">
                                            <span className="p-1 text-sm rounded-3xl bg-yellow-200 text-yellow-600 font-bold">TPE MAJ</span>
                                            <span> : {tpeMAJ}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                </div>
            </div>
        </>
    )
}