import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDemandesDeliveriesList from "../../components/livraisons/AllDemandesDeliveriesList"

export default function AllDemandesDeliveries() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez les demandes"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDemandesDeliveriesList />
                    </div>
                </div>  
            </div>
        </>
    )

}