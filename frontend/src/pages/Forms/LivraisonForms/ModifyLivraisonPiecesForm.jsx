import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import ModifyLivraisonPiecesInputs from "../../../components/form/livraisons/ModifyLivraisonPiecesInputs"


export default function ModifyLivraisonPiecesForm() {
    return(
        <>
            <PageBreadcrumb pageTitle="Modifier une livraison"/>
            <div className="grid grid-cols-1">
                <ModifyLivraisonPiecesInputs />
            </div>
        </>
    )
}