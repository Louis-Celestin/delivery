import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DemandeSupportInputs from "../../../components/form/demandes/DemandeSupportInputs"


export default function DemandeFormSupport() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Demande" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <DemandeSupportInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}