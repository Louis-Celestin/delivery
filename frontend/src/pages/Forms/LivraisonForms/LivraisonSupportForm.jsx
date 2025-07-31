import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import LivraisonSupportInputs from "../../../components/form/livraisons/LivraisonSupportInputs";

export default function LivraisonSupportForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Livraison" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <LivraisonSupportInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}