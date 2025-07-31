
import { useState } from "react";
// @ts-ignore
import LivraisonsGenerales from "../../components/livraisons/LivraisonsGenerales"
// @ts-ignore
import LivraisonsPieStats from "../../components/livraisons/LivraisonsPieStats"
// @ts-ignore
import ChargeursReturn from "../../components/livraisons/ChargeursReturn"
// @ts-ignore
import LivraisonsReturn from "../../components/livraisons/LivraisonsReturn"
// @ts-ignore
import LivraisonsLivrees from "../../components/livraisons/LivraisonsLivrees"
// @ts-ignore
import DemandesLivraisons from "../../components/livraisons/DemandesLivraisons"
// @ts-ignore
import DemandesAttentes from "../../components/mouvement_stock/DemandesAttentes"
// @ts-ignore
import DemandesValidees from "../../components/mouvement_stock/DemandesValidees"
// @ts-ignore
import DemandesReturn from "../../components/mouvement_stock/DemandesReturn"
// @ts-ignore
import DemandesCancel from "../../components/mouvement_stock/DemandesCancel"

import DatePicker from "../../components/form/date-picker";
import { startOfWeek, endOfWeek, format, getWeek } from "date-fns";
import { RefreshTimeIcon } from "../../icons";

export default function Dashboard() {

  const currentWeek = getWeek(new Date(), { weekStartsOn: 1 });
  // @ts-ignore
  const getFormattedDate = (date) => format(date, 'yyyy-MM-dd');
  const [startDate, setStartDate] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isDateChanged, setIsDateChanged] = useState(false);

  // useEffect( ()=>{
  //   const checkDateWeek = () =>{
  //     if(startDate != startOfWeek(new Date(), { weekStartsOn: 1 }) || endDate != endOfWeek(new Date(), { weekStartsOn: 1 }) ){
  //       setIsDateChanged(true)
  //       console.log('La date change')
  //       console.log("Startdate : ",startDate)
  //       console.log("Start of week : ",startOfWeek(new Date(), { weekStartsOn: 1 }))
  //     }
  //   }; checkDateWeek();
  // },[])

  return (
    <>
      <div className="mb-3">
        <div className="mb-2 flex justify-between">
          <span className="text-xl font-bold">
            DASHBOARD
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
        <div className="grid grid-cols-1">
          <div className="p-6 flex justify-center border bg-white rounded-2xl">
            <div className="mx-3">
              <DatePicker
                id="date-picker-debut"
                label="Date début"
                placeholder={getFormattedDate(startDate)}
                // @ts-ignore
                value={getFormattedDate(startDate)}
                onChange={(currentDateString) => {
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
    </>
  );
}
