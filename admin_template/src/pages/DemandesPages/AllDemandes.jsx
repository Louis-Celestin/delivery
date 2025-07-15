import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDemandesList from "../../components/mouvement_stock/AllDemandesList"

export default function AllDemandes() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos demandes"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDemandesList />
                    </div>
                </div>  
            </div>
        </>
    )

}