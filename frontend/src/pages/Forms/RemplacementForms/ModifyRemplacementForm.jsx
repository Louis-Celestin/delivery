import PageBreadcrumb from "../../../components/common/PageBreadCrumb";;
import ModifyRemplacementInputs from "../../../components/form/remplacements/ModifyRemplacementInputs";

export default function ModifyRemplacementForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier formulaire de Remplacement" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyRemplacementInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}