
import { useState } from "react";
import LivraisonsGenerales from "../../components/livraisons/LivraisonsGenerales"
import LivraisonsPieStats from "../../components/livraisons/LivraisonsPieStats"

import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";

export default function DeliveryDashboard() {

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 })

  return (
    <>
      <div className="mb-6">
        <div className="mb-2 flex justify-between">
          <span className="text-xl font-bold">
            DASHBOARD LIVRAISON
          </span>
          <div className="flex flex-col">
            <span className="text-2xl">
              Semaine {currentWeek}
            </span>
            <span className="text-xs opacity-40">
              Du {getFormattedDate(startDate)} au {getFormattedDate(endDate)}
            </span>
          </div>
        </div>
        <div className="my-2">
          <span className="border p-1 rounded-xl bg-green-300">
            Cumul de la semaine
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <LivraisonsGenerales />
        </div>
        <div>
          <LivraisonsPieStats />
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
