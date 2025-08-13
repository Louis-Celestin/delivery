import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import AjouterTypeLivraisonInputs from "../../../components/form/admin/AjouterTypeLivraisonInputs"

export default function AjouterTypeLivraisonForm() {
    return(
        <>
            <PageBreadcrumb pageTitle="Ajouter un type de livraison" />
            <div className="grid grid-cols-1">
                <AjouterTypeLivraisonInputs />
            </div>
        </>
    )
}