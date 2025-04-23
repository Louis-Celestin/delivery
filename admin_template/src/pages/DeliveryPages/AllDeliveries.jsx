import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDeliveriesList from "../../components/livraisons/AllDeliveriesList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"
import { useState } from "react"


export default function AllDeliveries() {

    const [filterType, setFilterType] = useState(null);
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos livraisons"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        <DeliveriesFilter onFilterSelect={setFilterType} />
                        <AllDeliveriesList filterType={filterType} />
                    </div>
                </div>  
            </div>
        </>
    )

}