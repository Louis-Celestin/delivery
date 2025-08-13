import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyLivraisonInputs from "../../../components/form/livraisons/ModifyLivraisonInputs"
export default function ModifyLivraisonForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier une livraison" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyLivraisonInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}