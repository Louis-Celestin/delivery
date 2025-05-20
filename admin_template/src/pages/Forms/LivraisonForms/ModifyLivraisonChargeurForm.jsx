import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyLivraisonChargeurInputs from "../../../components/form/form-elements/ModifyLivraisonChargeurInputs"
export default function ModifyLivraisonChargeurForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier une livraison de chargeur" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyLivraisonChargeurInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}