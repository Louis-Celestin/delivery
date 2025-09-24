import PageBreadcrumb from "../../../components/common/PageBreadCrumb";
import DemandeInputs from "../../../components/form/demandes/DemandeInputs"


export default function DemandeForm() {
    return (
        <div>
          <PageBreadcrumb pageTitle="Demande Pièce" />
          <div className="grid grid-cols-1 xl:grid-cols-1">
            <DemandeInputs />
          </div>  
        </div>
    )
}