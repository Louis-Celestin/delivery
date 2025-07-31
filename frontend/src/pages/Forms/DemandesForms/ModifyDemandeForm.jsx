import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyDemandeInputs from "../../../components/form/demandes/ModifyDemandeInputs";


export default function ModifyDemandeForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier une Demande" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyDemandeInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}