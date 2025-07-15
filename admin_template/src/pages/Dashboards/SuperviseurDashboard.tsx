import { useState } from "react";
// @ts-ignore
import LivraisonsGenerales from "../../components/livraisons/LivraisonsGenerales"
// @ts-ignore
import LivraisonsPieStats from "../../components/livraisons/LivraisonsPieStats"
// @ts-ignore
import LivraisonsAttente from "../../components/receptions/LivraisonsAttente"
// @ts-ignore
import LivraisonsRecu from "../../components/receptions/LivraisonsRecu"
// @ts-ignore
import LivraisonsReturnCommercial from "../../components/receptions/LivraisonsReturnCommercial"
// @ts-ignore
import LivraisonsAttenteMaintenance from "../../components/maintenance/LivraisonsAttenteMaintenance"
// @ts-ignore
import LivraisonsReturnMaintenance from "../../components/maintenance/LivraisonsReturnMaintenance"

// @ts-ignore
// import LivraisonsReturn from "../../components/supervision/LivraisonsReturn"
// @ts-ignore
import DemandesAttentes from "../../components/mouvement_stock/DemandesAttentes"
// @ts-ignore
import DemandesValidees from "../../components/mouvement_stock/DemandesValidees"
// @ts-ignore
import DemandesReturn from "../../components/mouvement_stock/DemandesReturn"
// @ts-ignore
import DemandesCancel from "../../components/mouvement_stock/DemandesCancel"

// @ts-ignore
import LivraisonsAttentesSupport from "../../components/support/LivraisonsAttentesSupport"
// @ts-ignore
import LivraisonsReturnSupport from "../../components/support/LivraisonsReturnSupport"


import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";

import { RefreshTimeIcon } from "../../icons";

export default function SuperviseurDashboard() {

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  // @ts-ignore
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isDateChanged, setIsDateChanged] = useState(false);

  return (
    <>
      <div className="mb-3">
        <div className="mb-2 flex justify-between">
          <span className="text-xl font-bold">
            DASHBOARD SUPERVISION
          </span>
          <div className="flex flex-col">
            {isDateChanged ? 
            (
              <></>
            ) : (
              <>
                <span className="text-2xl">
                  Semaine {currentWeek}
                </span>
              </>
            )}
            
            <span className="text-xs opacity-40">
              Du {getFormattedDate(startDate)} au {getFormattedDate(endDate)}
            </span>
          </div>
        </div>
        <div className="my-2">
          {isDateChanged ? 
          (
            <>
              <div>
                <button className="p-2 rounded-full bg-cyan-200 hover:bg-cyan-300" onClick={() => window.location.reload()}>
                  <span className="text-blue-400 text-2xl">
                    <RefreshTimeIcon />
                  </span>
                </button>
              </div>
            </>
          ) :
          (
            <span className="border p-1 rounded-xl bg-green-300">
              Cumul de la semaine
            </span>
          )}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-6 mt-6 my-3">
        <div>
            <div className="p-6 flex justify-center border bg-white rounded-2xl">
              <div className="mx-3">
                  <DatePicker
                    id="date-picker-debut"
                    label="Date début"
                    placeholder={getFormattedDate(startDate)}
                    // @ts-ignore
                    value={getFormattedDate(startDate)}
                    onChange={(currentDateString) => {
                      console.log("Date début changée : ",currentDateString)
                      // @ts-ignore
                      setStartDate(new Date(currentDateString))
                      setIsDateChanged(true)
                    }}
                  />
              </div>
              <div className="mx-3">
                  <DatePicker
                    id="date-picker"
                    label="Date fin"
                    placeholder={getFormattedDate(endDate)}
                    // @ts-ignore
                    value={getFormattedDate(endDate)}
                    onChange={(dates) => {
                      if (dates && dates[0]) {
                      let selectedDate = new Date(dates[0]);
                      let nextDay = new Date(selectedDate);
                      nextDay.setDate(selectedDate.getDate() + 1);
                      setEndDate(nextDay);
                      setIsDateChanged(true);
                    }}}
                  />
              </div>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="my-3">
          <span className="font-bold text-2xl text-neutral-400">Mouvement de stock</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-3">
        <DemandesAttentes />
        <DemandesValidees startDate={startDate} endDate={endDate} />
        <DemandesReturn startDate={startDate} endDate={endDate} />
        <DemandesCancel startDate={startDate} endDate={endDate} />
      </div>

       <div className="grid grid-cols-2 gap-6">
        <div className="my-3">
          <span className="font-bold text-2xl text-neutral-400">Livraisons Commerciales</span>
        </div>
      </div>

       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-3 gap-6">
          <div className="">
            <LivraisonsAttente />
          </div>
          <div className="">
            <LivraisonsRecu startDate={startDate} endDate={endDate} />
          </div>
          <div>
            <LivraisonsReturnCommercial startDate={startDate} endDate={endDate} />
          </div>
        </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="my-3">
          <span className="font-bold text-2xl text-neutral-400">Livraisons Maintenance</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-3 gap-6">
        <div className="">
          <LivraisonsAttenteMaintenance />
        </div>
        <div>
          <LivraisonsReturnMaintenance startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="my-3">
          <span className="font-bold text-2xl text-neutral-400">Livraisons Support</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 my-3 gap-6">
        <div className="">
          <LivraisonsAttentesSupport />
        </div>
        <div>
          <LivraisonsReturnSupport startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="my-3">
          <span className="font-bold text-2xl text-neutral-400">Livraisons Globales</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6 my-3">
        <div className="grid grid-cols-1">
          <LivraisonsGenerales startDate={startDate} endDate={endDate} />
        </div>
        <div>
          <LivraisonsPieStats startDate={startDate} endDate={endDate} />
        </div>
      </div>
  
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {/* <div className="col-span-4 space-y-6">
          <TerminalOrders />
        </div> */}
        {/* <div className="col-span-4 space-y-6">
          <RetourChargeurs />
        </div> */}
        {/* <div className="col-span-12 space-y-6 xl:col-span-7">
          <EcommerceMetrics />

          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
