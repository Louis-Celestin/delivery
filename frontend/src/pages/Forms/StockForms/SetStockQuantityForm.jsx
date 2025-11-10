import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import SetStockQuantityInputs from "../../../components/form/stock/SetStockQuantityInputs"

export default function SetStockQuantityForm() {
    return (
        <>
            <PageBreadcrumb pageTitle="Modification de stock"/>
            <div>
                <SetStockQuantityInputs />
            </div>
        </>
    )
}