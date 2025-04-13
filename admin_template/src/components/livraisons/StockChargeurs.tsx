import { useState, useEffect } from "react";


import {
    BaseLinePhoneIcon,
    CableDataIcon,
}from "../../icons";


export default function TerminalOrders() {

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-light text-gray-800 dark:text-white/90">
                        Chargeurs en stock
                    </h3>
                    <span className="text-3xl p-1 rounded-xl bg-green-300 ">
                        <CableDataIcon />
                    </span>
                </div>
                <div>
                    <span className="text-3xl font-bold my-3">110</span>
                </div>
            </div>

        </div>
    )

}