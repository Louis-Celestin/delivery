import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDeliveriesVueList from "../../components/livraisons/AllDeliveriesVueList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"

export default function AllDeliveriesVue() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez les livraisons"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDeliveriesVueList />
                    </div>
                </div>  
            </div>
        </>
    )

}