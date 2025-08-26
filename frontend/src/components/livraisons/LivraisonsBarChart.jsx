import React, { useState, useEffect } from "react"

import { ProgressSpinner } from 'primereact/progressspinner';
import { BaseLinePhoneIcon, CableDataIcon, PhoneSetting } from "../../icons/index.ts";

import { ProductDeliveries } from "../../backend/livraisons/ProductDeliveries.js";

import DatePicker from "../form/date-picker.tsx"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

// import Chart from "react-apexcharts";
// import { ApexOptions } from "apexcharts";

import { Chart } from "primereact/chart";

export default function LivraisonsBarChart({ startDate, endDate }) {
    const deliveryData = new ProductDeliveries()
    
    const [loading, setLoading] = useState(false)
    const [listeLivraisons, setListeLivraisons] = useState([])
    const [typesLivraison, setTypesLivraison] = useState([])
    const [optionsBar, setOptionsBar] = useState([])
    const [dataBar, setDataBar] = useState([])

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

    useEffect( () =>{
      const fetchDeliveriesData = async () =>{
        try{
          setLoading(true)
          const deliveries_data = await deliveryData.getAllLivraisons()
          setListeLivraisons(deliveries_data)

          const typesLivraison_data = await deliveryData.getAllTypeLivraisonCommerciale()
          setTypesLivraison(typesLivraison_data)
          const nomTypeLivraison = typesLivraison_data.map((item) => {
              return item.nom_type_livraison
          })
          const data_livraison = typesLivraison_data.map((item) => {
              return sumLivraison(item.id_type_livraison)
          })

          const documentStyle = getComputedStyle(document.documentElement);
          const textColor = documentStyle.getPropertyValue('--text-color');
          const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
          const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
          const data = {
            labels: nomTypeLivraison,
            datasets: [
              {
                label: 'Données livraisons',
                backgroundColor: documentStyle.getPropertyValue('--green-500'),
                borderColor: documentStyle.getPropertyValue('--blue-500'),
                data: data_livraison
              },
            ]
          };
          setDataBar(data)
          const options = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                  labels: {
                    fontColor: textColor
                  }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                }
            }
          };
          setOptionsBar(options)
        } catch(error){
          console.log('Error component livraison : ', error)
        } finally{
          setLoading(false)
        }
      }
      fetchDeliveriesData()
    },[startDate,endDate])

    


    return (
        <>
          <div>
            <div className="card border rounded-2xl bg-white p-2">
              <Chart type="bar" data={dataBar} options={optionsBar} />
            </div>
          </div>
        </>
    )
}