import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

import LivraisonsAttente from "../../components/receptions/LivraisonsAttente"
import LivraisonsRecu from "../../components/receptions/LivraisonsRecu"

import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";

// import TerminalOrders from "../../components/livraisons/StockChargeurs"


export default function ReceiveDashboard() {
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const endDate = endOfWeek(new Date(), { weekStartsOn: 1 })

  return (
    <>
      <div className="mb-6">
        <div className="mb-2 flex justify-between">
          <span className="text-xl font-bold">
            DASHBOARD RECEPTION
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
      <div className="grid grid-cols-12 gap-4 md:gap-6">

        <div className="col-span-12 space-y-6 xl:col-span-3">
          <LivraisonsAttente />
          {/* <EcommerceMetrics />

          <MonthlySalesChart /> */}

        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <MonthlyTarget />
        </div> */}

        <div className="col-span-12 xl:col-span-3">
          <LivraisonsRecu />
          {/* <StatisticsChart /> */}
        </div>

        {/* <div className="col-span-12 xl:col-span-5">
          <DemographicCard />
        </div>

        <div className="col-span-12 xl:col-span-7">
          <RecentOrders />
        </div> */}
      </div>
    </>
  );
}
