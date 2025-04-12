import { useState, useEffect } from "react";
import { entreeStock } from "../../backend/livraisons/livraisonterminals";

import {
    BaseLinePhoneIcon,
    CableDataIcon,
}from "../../icons";


export default function TerminalOrders() {

    const [qteChargeurs, setQteChargeurs] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await entreeStock(); // Call API
                setQteChargeurs(data.quantite); // Update state (adjust based on API response structure)
                console.log(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Run API call
    }, []);

    return (
        <div className="rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800">
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
                        Chargeurs en stock
                    </h3>
                    <span className="text-4xl">
                        <CableDataIcon />
                    </span>
                </div>
                <div>
                    <span className="text-5xl my-3">{qteChargeurs !== null ? qteChargeurs : "Loading..."}</span>
                </div>
            </div>

        </div>
    )

}