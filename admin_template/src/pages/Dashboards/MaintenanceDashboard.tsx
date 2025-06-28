import { useState } from "react";
// @ts-ignore
import LivraisonsTPERepare from "../../components/maintenance/LivraisonsTPERepare"
// @ts-ignore
import LivraisonsChargeur from "../../components/maintenance/LivraisonsChargeur"
// @ts-ignore
import LivraisonsAttenteMaintenance from "../../components/maintenance/LivraisonsAttenteMaintenance"
// @ts-ignore
import LivraisonsReturnMaintenance from "../../components/maintenance/LivraisonsReturnMaintenance"

import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek} from "date-fns";
import { RefreshTimeIcon } from "../../icons";

export default function MaintenanceDashboard() {

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  // @ts-ignore
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
      <div className="grid md:grid-cols-2 gap-6 mb-6">
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
        <div className="grid grid-cols-2 gap-6">
          <LivraisonsAttenteMaintenance />
          <LivraisonsReturnMaintenance startDate={startDate} endDate={endDate} />
        </div>
      </div>
        <div className="grid grid-cols-1 gap-6 space-y-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-6">
                <LivraisonsTPERepare startDate={startDate} endDate={endDate} />
                <LivraisonsChargeur startDate={startDate} endDate={endDate} />
            </div>
            {/* <div className="grid md:grid-cols-2 gap-6">
            </div> */}
        </div>
    </>
  );
}
