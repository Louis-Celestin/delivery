import React, { useState, useEffect } from "react"

import PageBreadcrumb from "../common/PageBreadCrumb.tsx";

import { ProgressSpinner } from 'primereact/progressspinner';
import { BaseLinePhoneIcon, CableDataIcon, PhoneSetting } from "../../icons/index.ts";

import { ProductDeliveries } from "../../backend/livraisons/ProductDeliveries.js";

import DatePicker from "../form/date-picker.tsx"
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";


export default function StatistiquesLivraisons() {
    
    const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
    const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
    const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
    const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

    
    const [loading, setLoading] = useState(false);

    const [tpeGIM, setTPEGIM] = useState(0)
    const [tpeMobile, setTPEMobile] = useState(0)
    const [tpeMAJ, setTPEMAJ] = useState(0)
    const [tpeRepare, setTPERepare] = useState(0)
    const [tpeEcobank, setTPEEcobank] = useState(0)
    const [nbeChargeur, setNbeChargeur] = useState(0);

    const productDeliveries = new ProductDeliveries();

    useEffect(() => {
        const fetchFilteredData = async () => {

            setLoading(true);
            try {
                const allData = await productDeliveries.getAllLivraisons();

                const filtered = allData.filter(item => {
                    let deliveryDate
                    if(item.validations.length > 0){
                        deliveryDate = new Date(item.validations[0].date_validation);
                    }
                    return  deliveryDate >= startDate && 
                            deliveryDate <= endDate &&
                            item.statut_livraison === 'livre';
                });
                console.log(filtered)

                const sums = {
                    1: 0, // TPE GIM
                    2: 0, // TPE REPARE
                    3: 0, // TPE MAJ
                    4: 0, // TPE MOBILE
                    5: 0,  // CHARGEUR
                    6: 0, // TPE ECOBANK
                };

                filtered.forEach(item => {
                    const type = item.type_livraison_id;
                    if (sums[type] !== undefined) {
                        sums[type] += Number(item.qte_totale_livraison || 0);
                    }
                });

                setTPEGIM(sums[1]);
                setTPERepare(sums[2]);
                setTPEMAJ(sums[3]);
                setTPEMobile(sums[4]);
                setNbeChargeur(sums[5]);
                setTPEEcobank(sums[6])
            } catch (error) {
                console.error("Error fetching deliveries:", error);
            } finally {
                setLoading(false);
            }
        }; fetchFilteredData();
    }, [startDate, endDate]);


    return (
        <>
            <PageBreadcrumb pageTitle="Statistiques livraison"/>
            <div>
                <div className="mb-6 p-6 flex justify-center border bg-white rounded-2xl">
                  <div className="mx-3">
                    <DatePicker
                      id="date-picker-debut"
                      label="Date début"
                      placeholder={getFormattedDate(startDate)}
                      value={getFormattedDate(startDate)}
                      onChange={(dates, currentDateString) => {
                          console.log("Date début changée : ",currentDateString)
                          setStartDate(new Date(currentDateString));
                      }}
                    />
                  </div>
                  <div className="mx-3">
                    <DatePicker
                      id="date-picker"
                      label="Date fin"
                      placeholder={getFormattedDate(endDate)}
                      value={getFormattedDate(endDate)}
                      onChange={(dates, currentDateString) => {
                          console.log("Date fin changée : ",currentDateString)
                          setEndDate(new Date(currentDateString));
                      }}
                    />
                  </div>
                </div>
            </div>
            <div className="grid grid-cols-1 gap-2">
                <div className="grid grid-cols-4 gap-2 md:gap-6 mb-6">
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        TPE GIM
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-purple-300 ">
                                        <BaseLinePhoneIcon />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{tpeGIM}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        TPE MOBILE
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-green-300 ">
                                        <BaseLinePhoneIcon />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{tpeMobile}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        TPE MAJ
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-purple-500 ">
                                        <BaseLinePhoneIcon />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{tpeMAJ}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        TPE REPARE
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-red-300 ">
                                        <PhoneSetting />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{tpeRepare}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        CHARGEUR
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-yellow-200 ">
                                        <CableDataIcon />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{nbeChargeur}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-2 space-y-6">
                        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-gray-800">
                            <div>
                                <div className="flex items-center justify-between">
                                    <h3 className="text-md font-light text-gray-800 dark:text-white/90">
                                        TPE ECOBANK
                                    </h3>
                                    <span className="text-3xl p-1 rounded-xl bg-cyan-200 ">
                                        <BaseLinePhoneIcon />
                                    </span>
                                </div>
                                <div>
                                    {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span className="text-3xl font-bold my-3 dark:text-white">{tpeEcobank}</span>)}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}