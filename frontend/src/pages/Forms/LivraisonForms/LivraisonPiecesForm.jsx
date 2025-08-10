import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import LivraisonPiecesInputs from "../../../components/form/livraisons/LivraisonPiecesInputs";

export default function LivraisonPiecesForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Livraison" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <LivraisonPiecesInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}