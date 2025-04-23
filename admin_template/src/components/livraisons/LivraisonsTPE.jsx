import React, { useState, useEffect } from "react"

import { Chart } from 'primereact/chart';
import { ProgressSpinner } from 'primereact/progressspinner';

import { StatsLivraisons } from "../../backend/livraisons/StatsLivraisons";

export default function LivraisonsTPE() {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [loading, setLoading] = useState(false);

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
                const documentStyle = getComputedStyle(document.documentElement);
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
            <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                <div className="flex item-center justify-center">
                    {loading ? (
                        <ProgressSpinner />
                    ) : (
                        <div className="card flex justify-content-center">
                            <Chart type="pie" data={chartData} options={chartOptions} className="w-full md:w-30rem" />
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}