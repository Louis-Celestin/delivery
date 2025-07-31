import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import AncienneLivraisonInputs from "../../../components/form/form-elements/AncienneLivraisonInputs"

export default function AncienneLivraisonForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Ancienne Livraison" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <AncienneLivraisonInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}