import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import ModifyProfilInputs from "../../../components/form/users/ModifyProfilInputs"


export default function ModifyProfilForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Modifier profil utilisateur" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <ModifyProfilInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}