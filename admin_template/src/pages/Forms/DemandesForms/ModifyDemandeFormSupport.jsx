import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyDemandeSupportInputs from "../../../components/form/demandes/ModifyDemandeSupportInputs";


export default function ModifyDemandeFormSupport() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier une Demande" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyDemandeSupportInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}