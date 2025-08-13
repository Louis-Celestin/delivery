import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import TypesLivraisonsList from "../../../components/admin/gestion_livraisons/TypesLivraisonsList"

export default function TypesLivraisonsPage() {
    return (
        <>
            <div>
                <PageBreadcrumb pageTitle="Tous les types de livraisons" />
                <div className="grid grid-cols-1">
                    <TypesLivraisonsList />
                </div>
            </div>
        </>
    )
}