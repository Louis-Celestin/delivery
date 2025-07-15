import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DemandeInputs from "../../../components/form/demandes/DemandeInputs"


export default function DemandeForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Demande" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <DemandeInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}