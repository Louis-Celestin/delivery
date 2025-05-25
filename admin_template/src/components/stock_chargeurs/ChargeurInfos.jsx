import { useState, useEffect } from "react"
import {CableDataIcon, AlertIcon, InfoIcon} from "../../icons/index"
import { ProgressSpinner } from "primereact/progressspinner"

export default function ChargeurInfos() {

    const [loading, setLoading] = useState(false)
    return (
        <>
            <div>
               <div className="rounded-2xl border border-cyan-300 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
                    <div>
                        <div className="flex items-center border-b pb-3 mb-3">
                            <span><InfoIcon /></span>
                            <span>Chargeurs en stock</span>
                        </div>
                        <div className="flex justify-between items-center text-title-md">
                            <>
                                {loading ? 
                                    (<ProgressSpinner style={{width: '15px', height: '15px'}} strokeWidth="8" animationDuration=".5s" />):
                                    (<span>3</span>)
                                }
                            </>
                            <span className="text-cyan-400"><CableDataIcon /></span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}