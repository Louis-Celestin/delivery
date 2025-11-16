import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import CreateStockInputs from "../../../components/form/stock/CreateStockInputs"

export default function SetStockQuantityForm() {
    return (
        <>
            <PageBreadcrumb pageTitle="Création de stock"/>
            <div>
                <CreateStockInputs />
            </div>
        </>
    )
}