import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDemandesSupportList from "../../components/mouvement_stock/AllDemandesSupportList"

export default function AllDemandesSupport() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos demandes"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDemandesSupportList />
                    </div>
                </div>  
            </div>
        </>
    )

}