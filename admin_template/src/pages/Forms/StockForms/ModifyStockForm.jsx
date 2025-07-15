import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyStockInputs from "../../../components/form/stock/ModifyStockInputs"


export default function ModifyStockForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier stock" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyStockInputs />
              </div>
            </div>
            {/* <div className="space-y-6">
                <TerminalOrdersTable />
            </div> */}
          </div>  
        </div>
    )
}