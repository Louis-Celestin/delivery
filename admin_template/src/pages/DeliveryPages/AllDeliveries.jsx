import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDeliveriesList from "../../components/livraisons/AllDeliveriesList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"

export default function AllDeliveries() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos livraisons"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDeliveriesList />
                    </div>
                </div>  
            </div>
        </>
    )

}