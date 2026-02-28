import PageBreadcrumb from "../../../../components/common/PageBreadCrumb"
import RegularisationLivraisonQrInputs from "../../../../components/form/livraisons/LivraisonQR/RegularisationLivraisonQrInputs"


export default function RegularisationLivraisonQrForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Régularisation Livraison QR code" />
          <div className="grid grid-cols-1 xl:grid-cols-1">
            <RegularisationLivraisonQrInputs />
          </div>  
        </div>
    )
}