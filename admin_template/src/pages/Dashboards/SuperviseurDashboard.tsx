import { useState } from "react";
import LivraisonsGenerales from "../../components/livraisons/LivraisonsGenerales"
import LivraisonsPieStats from "../../components/livraisons/LivraisonsPieStats"
import LivraisonsAttente from "../../components/receptions/LivraisonsAttente"
import LivraisonsRecu from "../../components/receptions/LivraisonsRecu"
import LivraisonsReturn from "../../components/receptions/LivraisonsReturn"

import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";

import { RefreshTimeIcon } from "../../icons";

export default function SuperviseurDashboard() {

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isDateChanged, setIsDateChanged] = useState(false);

  return (
    <>
      <div className="mb-6">
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
      <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-6 space-y-6">
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
                      value={getFormattedDate(endDate)}
                      onChange={(dates, currentDateString) => {
                        console.log("Date fin changée : ",currentDateString)
                        setEndDate(new Date(currentDateString))
                        setIsDateChanged(true)
                      }}
                    />
                </div>
            </div>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="mb-6">
          <span className="font-bold text-2xl text-neutral-400">Informations Livraisons</span>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        <div className="grid grid-cols-1">
          <LivraisonsGenerales startDate={startDate} endDate={endDate} />
        </div>
        <div>
          <LivraisonsPieStats startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="mb-6">
          <span className="font-bold text-2xl text-neutral-400">Informations Réceptions</span>
        </div>
      </div>

       <div className="grid lg:grid-cols-3 space-y-3 gap-4 md:gap-6">
          <div className="">
            <LivraisonsAttente />
          </div>
          <div className="">
            <LivraisonsRecu startDate={startDate} endDate={endDate} />
          </div>
          <div>
            <LivraisonsReturn startDate={startDate} endDate={endDate} />
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
