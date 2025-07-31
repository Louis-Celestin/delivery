import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import LivraisonChargeurInputs from "../../../components/form/form-elements/LivraisonChargeurInputs";


export default function LivraisonChargeurForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Livraison CHARGEUR"/>
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <LivraisonChargeurInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}