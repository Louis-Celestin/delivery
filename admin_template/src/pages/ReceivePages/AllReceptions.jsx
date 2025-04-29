import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllReceptionsList from "../../components/receptions/AllReceptionsList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"
import { useState } from "react"


export default function AllReceptions() {

    const [filterType, setFilterType] = useState(null);
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos réceptions"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        <DeliveriesFilter onFilterSelect={setFilterType} />
                        <AllReceptionsList filterType={filterType} />
                    </div>
                </div>  
            </div>
        </>
    )

}