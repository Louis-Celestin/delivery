import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllReceptionsList from "../../components/receptions/AllReceptionsList"
import DeliveriesFilter from "../../components/livraisons/DeliveriesFilter"


export default function AllReceptions() {

    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos réceptions"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllReceptionsList />
                    </div>
                </div>  
            </div>
        </>
    )

}