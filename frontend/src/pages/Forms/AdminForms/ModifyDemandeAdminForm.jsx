import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import ModifyDemandeAdminInputs from "../../../components/form/admin/ModifyDemandeAdminInputs"

export default function ModifyDemandeAdminForm() {
    return (
        <>
            <div>
                <PageBreadcrumb pageTitle="Modification Admin | Demande" />
                <div className="grid grid-cols-1">
                    <ModifyDemandeAdminInputs />
                </div>
            </div>
        </>
    )
}