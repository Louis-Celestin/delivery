import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllSupportDeliveriesList from "../../components/support/AllSupportDeliveriesList"

export default function AllSupportDeliveries() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez les livraisons"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllSupportDeliveriesList />
                    </div>
                </div>  
            </div>
        </>
    )

}