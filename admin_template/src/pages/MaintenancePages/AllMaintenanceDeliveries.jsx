import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllMaintenanceDeliveriesList from "../../components/maintenance/AllMaintenanceDeliveriesList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"

export default function AllMaintenanceDeliveries() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez les livraisons"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllMaintenanceDeliveriesList />
                    </div>
                </div>  
            </div>
        </>
    )

}