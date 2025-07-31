import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyPieceInputs from "../../../components/form/stock/ModifyPieceInputs"


export default function ModifyPieceForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier pièce" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyPieceInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}