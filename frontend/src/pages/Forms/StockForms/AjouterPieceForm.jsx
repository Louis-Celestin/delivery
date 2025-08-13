import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import AjouterPieceInputs from "../../../components/form/stock/AjouterPieceInputs"

export default function AjouterPieceForm() {
    return(
        <>
            <PageBreadcrumb pageTitle="Ajouter pièce stock" />
            <div className="grid grid-cols-1">
                <AjouterPieceInputs />
            </div>
        </>
    )
}