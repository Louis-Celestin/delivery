import PageBreadcrumb from "../../../components/common/PageBreadCrumb";;
import RemplacementInputs from "../../../components/form/remplacements/RemplacementInputs";

export default function RemplacementForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Remplacement" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <RemplacementInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}