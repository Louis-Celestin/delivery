import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import ModifyTypeLivraisonInputs from "../../../components/form/admin/ModifyTypeLivraisonInputs"

export default function ModifyTypeLivraisonForm() {
    return (
        <>
            <PageBreadcrumb pageTitle="Modifier un type de livraison" />
            <div className="grid grid-cols-1">
                <ModifyTypeLivraisonInputs />
            </div>
        </>
    )
}