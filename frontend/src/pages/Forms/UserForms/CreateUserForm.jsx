import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import CreateUserInputs from "../../../components/form/users/CreateUserInputs"


export default function CreateUserForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Créer un nouvel utilisateur" />
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-1">
            <div className="space-y-6 flex justify-center">
              <div className="w-full">
                <CreateUserInputs />
              </div>
            </div>
          </div>  
        </div>
    )
}