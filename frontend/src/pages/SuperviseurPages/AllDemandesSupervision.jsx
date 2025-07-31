import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDemandesSupervisionList from "../../components/supervision/AllDemandesSupervisionList"

export default function AllDemandesSupervision() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos demandes"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDemandesSupervisionList />
                    </div>
                </div>  
            </div>
        </>
    )

}