import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import LivraisonDemandeInputs from "../../../components/form/demandes/LivraisonDemandeInputs";

export default function LivraisonDemandeForm() {
    return(
        <>
            <div>
                <PageBreadcrumb pageTitle="Livraison stock"/>
                <div className="grid grid-cols-1 xl:grid-cols-1">
                    <LivraisonDemandeInputs />
                </div>
            </div>
        </>
    )
}