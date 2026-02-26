import PageBreadcrumb from "../../../components/common/PageBreadCrumb"
import ValidateDemandeInputs from "../../../components/form/demandes/ValidateDemandeInputs"
export default function ValidateDemandeForm() {
    return (
        <>
            <div>
                <PageBreadcrumb pageTitle="Validation de demande"/>
                <div className="grid grid-cols-1 xl:grid-cols-1">
                    <ValidateDemandeInputs />
                </div>
            </div>
        </>
    )
}