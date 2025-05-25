import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

import { useState } from "react";

import LivraisonsAttente from "../../components/receptions/LivraisonsAttente"
import LivraisonsRecu from "../../components/receptions/LivraisonsRecu"
import LivraisonsGenerales from "../../components/livraisons/LivraisonsGenerales"
import LivraisonsPieStats from "../../components/livraisons/LivraisonsPieStats"
import LivraisonsReturn from "../../components/receptions/LivraisonsReturn"

import DatePicker from "../../components/form/date-picker";

import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";

// import TerminalOrders from "../../components/livraisons/StockChargeurs"


export default function ReceiveDashboard() {
  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));

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
      <div className="grid grid-cols-2 gap-6 space-y-3">
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
        <div className="grid grid-cols-2 space-y-3 gap-4 md:gap-6">
          <div className="">
            <LivraisonsAttente />
          </div>
          <div className="">
            <LivraisonsRecu startDate={startDate} endDate={endDate} />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-1">
          <LivraisonsGenerales startDate={startDate} endDate={endDate} />
        </div>
        <div>
          <LivraisonsPieStats startDate={startDate} endDate={endDate} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="grid grid-cols-2">
          <LivraisonsReturn startDate={startDate} endDate={endDate} />
        </div>
      </div>

    </>
  );
}
