import { useState } from "react";
import LivraisonsTPERepare from "../../components/maintenance/LivraisonsTPERepare"
import LivraisonsChargeur from "../../components/maintenance/LivraisonsChargeur"

import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek, formatDate } from "date-fns";
import { RefreshTimeIcon } from "../../icons";

export default function MaintenanceDashboard() {

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
            DASHBOARD MAINTENANCE
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
      <div className="grid md:grid-cols-2 gap-6">
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
        <div className="grid grid-cols-2 gap-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <LivraisonsTPERepare startDate={startDate} endDate={endDate} />
                <LivraisonsChargeur startDate={startDate} endDate={endDate} />
            </div>
        </div>
    </>
  );
}
