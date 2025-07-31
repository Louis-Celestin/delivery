import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import AllDemandesMaintenanceList from "../../components/mouvement_stock/AllDemandesMaintenanceList"

export default function AllDemandesMaintenance() {
    
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Retrouvez vos demandes"/>
                <div className="grid grid-cols-1">
                    <div className="space-y-6">
                        {/* <DeliveriesFilter onFilterSelect={setFilterType} /> */}
                        <AllDemandesMaintenanceList />
                    </div>
                </div>  
            </div>
        </>
    )

}